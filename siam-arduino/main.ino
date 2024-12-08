#include "WiFiConnection.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <time.h>
#include <ESP32Servo.h>  // Biblioteca do servo

const char* ssid = "iPhone de Daniele (2)";
const char* password = "oidani2018";
const char* serverUrl = "http://172.20.10.9:3000/medication/get-medications";
const char* registerDoseUrl = "http://172.20.10.9:3000/adherence/register-dose";

const int ledPin = 15;              // LED
const int speakerPin = 2;           // Speaker
const int trigPin = 5;              // Sensor
const int echoPin = 18;             // Sensor
const int servoPin = 19;            // Pino do servo
const int photoTransistorPin = 34;  // Pino do photo transistor (entrada analógica)

WiFiConnection wifi(ssid, password);
Servo myServo;
String authToken = "";
bool ledOn = false;

void getMedicationsList();
void checkMedicationSchedule(const JsonArray& medications);
void registerDose(int medicationId, bool taken);
bool isCupRemoved();
void playMelody();

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  pinMode(speakerPin, OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(photoTransistorPin, INPUT);

  digitalWrite(ledPin, LOW);
  wifi.connect();

  authToken = login();
  if (authToken.isEmpty()) {
    Serial.println("Falha ao obter token. Verifique suas credenciais.");
  } else {
    Serial.println("Login realizado com sucesso!");
  }

  configTime(-3 * 3600, 0, "pool.ntp.org");  // horário de Brasília

  myServo.attach(servoPin);
  myServo.write(90);  // Servo em posição inicial

  getMedicationsList();
}

void loop() {
  static unsigned long lastFetchTime = 0;
  if (millis() - lastFetchTime >= 60000) {  // 1 minuto
    getMedicationsList();
    lastFetchTime = millis();
  }

  delay(1000);
}

void getMedicationsList() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Authorization", "Bearer " + authToken);

    http.addHeader("user-id", "2");


    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Server response:");
      Serial.println(response);

      StaticJsonDocument<4096> doc;
      DeserializationError error = deserializeJson(doc, response);
      if (!error) {
        JsonArray medications = doc.as<JsonArray>();
        checkMedicationSchedule(medications);
      } else {
        Serial.print("JSON error: ");
        Serial.println(error.c_str());
      }
    } else {
      Serial.print("Request error: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("Wi-Fi disconnected.");
  }
}

void checkMedicationSchedule(const JsonArray& medications) {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time!");
    return;
  }

  int today = timeinfo.tm_wday;
  char timeStr[6];
  strftime(timeStr, sizeof(timeStr), "%H:%M", &timeinfo);

  for (JsonObject med : medications) {
    for (JsonObject schedule : med["administrationschedules"].as<JsonArray>()) {
      const char* time = schedule["time"];
      JsonArray daysOfWeek = schedule["daysOfWeek"];

      if (strncmp(time, timeStr, 5) == 0) {
        bool dayMatch = false;
        for (const char* day : daysOfWeek) {
          if ((today == 0 && strcmp(day, "Domingo") == 0) || (today == 1 && strcmp(day, "Segunda") == 0) || (today == 2 && strcmp(day, "Terça") == 0) || (today == 3 && strcmp(day, "Quarta") == 0) || (today == 4 && strcmp(day, "Quinta") == 0) || (today == 5 && strcmp(day, "Sexta") == 0) || (today == 6 && strcmp(day, "Sábado") == 0)) {
            dayMatch = true;
            break;
          }
        }

        if (dayMatch) {
          Serial.println("Medication time detected. Activating servo motor!");

          myServo.attach(servoPin);

          while (!isMedicationDropped()) {
            for (int pos = 0; pos <= 180; pos += 1) {
              myServo.write(pos);
              delay(15);
              if (isMedicationDropped()) break;
            }
            for (int pos = 180; pos >= 0; pos -= 1) {
              myServo.write(pos);
              delay(15);
              if (isMedicationDropped()) break;
            }
          }

          myServo.write(90);  // Retorna o servo para a posição inicial

          myServo.detach();

          Serial.println("Object detected. Stopping servo motor.");

          unsigned long melodyStartTime = millis();
          bool cupRemoved = false;

          while (millis() - melodyStartTime < 60000) {
            if (isCupRemoved()) {
              cupRemoved = true;
              Serial.println("Cup removed, stopping melody.");
              break;
            }
            playMelody();
          }

          if (!cupRemoved) {
            Serial.println("Cup not removed, registering dose as not taken.");
            registerDose(med["id"], false);
          } else {
            registerDose(med["id"], true);
          }

          digitalWrite(ledPin, LOW);
          ledOn = false;
          return;
        }
      }
    }
  }

  if (ledOn) {
    Serial.println("Medication time passed. Turning off LED and sound!");
    digitalWrite(ledPin, LOW);
    noTone(speakerPin);
    ledOn = false;
  }
}

void playMelody() {
  int melody[] = { 262, 294, 330, 349, 392, 440, 494, 523 };
  int noteDurations[] = { 4, 4, 4, 4, 4, 4, 4, 4 };

  for (int thisNote = 0; thisNote < 8; thisNote++) {
    int noteDuration = 1000 / noteDurations[thisNote];
    tone(speakerPin, melody[thisNote], noteDuration);
    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
    noTone(speakerPin);
  }
}

bool isMedicationDropped() {
  int sensorValue = analogRead(photoTransistorPin);
  Serial.print("Photo Transistor Value: ");
  Serial.println(sensorValue);
  return sensorValue > 500;
}

long getDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  long distance = duration * 0.034 / 2;
  return distance;
}

bool isCupRemoved() {
  long distance = getDistance();
  return distance > 10;
}

void registerDose(int medicationId, bool taken) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(registerDoseUrl);
    http.addHeader("Authorization", "Bearer " + authToken);
    http.addHeader("user-id", "2");
    http.addHeader("Content-Type", "application/json");

    Serial.println(authToken);

    StaticJsonDocument<200> doc;
    doc["medicationId"] = medicationId;
    doc["taken"] = taken;

    Serial.println(medicationId);
    Serial.println(taken);

    String requestBody;
    serializeJson(doc, requestBody);

    Serial.println(requestBody);

    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode > 0) {
      Serial.print("Dose registered: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Failed to register dose: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }
}

String login() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("http://172.20.10.9:3000/login");
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["username"] = "daniorze";
    doc["password"] = "daniorze1";

    String requestBody;
    serializeJson(doc, requestBody);

    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode > 0) {
      String response = http.getString();
      StaticJsonDocument<512> responseDoc;
      DeserializationError error = deserializeJson(responseDoc, response);

      if (!error && responseDoc.containsKey("token")) {
        String token = responseDoc["token"].as<String>();
        Serial.println("Token obtido: " + token);
        http.end();
        return token;
      } else {
        Serial.println("Erro ao obter o token: " + response);
      }
    } else {
      Serial.println("Erro na requisição de login: " + String(httpResponseCode));
    }
    http.end();
  }
  return "";
}
