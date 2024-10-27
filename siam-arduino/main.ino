#include "WiFiConnection.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <time.h>

const char* ssid = "NAXI-ORZECHOWSKI-2G";
const char* password = "antajuda";
const char* serverUrl = "http://192.168.100.82:3000/get-medications";
const char* registerDoseUrl = "http://192.168.100.82:3000/register-dose";

const int ledPin = 15;    // LED
const int speakerPin = 2; // Speaker
const int trigPin = 5;   // Sensor
const int echoPin = 18;   // Sensor

WiFiConnection wifi(ssid, password);
bool ledOn = false;

void getMedicationsList();
void checkMedicationSchedule(const JsonArray& medications);
void registerDose(int medicationId, bool taken);

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  pinMode(speakerPin, OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  digitalWrite(ledPin, LOW);
  wifi.connect();
  configTime(-3 * 3600, 0, "pool.ntp.org");  // horário de brasília
  
  getMedicationsList();
}

void loop() {
  static unsigned long lastFetchTime = 0;
  if (millis() - lastFetchTime >= 60000) {  // 1 hora
    getMedicationsList();
    lastFetchTime = millis();
  }
  
  delay(1000);
}

void getMedicationsList() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);  
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
          if ((today == 0 && strcmp(day, "Domingo") == 0) ||
              (today == 1 && strcmp(day, "Segunda") == 0) ||
              (today == 2 && strcmp(day, "Terça") == 0) ||
              (today == 3 && strcmp(day, "Quarta") == 0) ||
              (today == 4 && strcmp(day, "Quinta") == 0) ||
              (today == 5 && strcmp(day, "Sexta") == 0) ||
              (today == 6 && strcmp(day, "Sábado") == 0)) {
            dayMatch = true;
            break;
          }
        }
        
        if (dayMatch) {
          Serial.println("Medication time detected. Turning on LED and sound!");
          digitalWrite(ledPin, HIGH);
          tone(speakerPin, 1000);
          delay(1000);
          noTone(speakerPin);
          ledOn = true;

          delay(5000);  // tempo para conferir se tomou
          
          float distance = measureDistance();
          if (distance > 10) {
            registerDose(med["id"], true);  // tomou
          } else {
            registerDose(med["id"], false);  // não tomou
          }
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

float measureDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  float distance = (duration * 0.034) / 2;
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  return distance;
}

void registerDose(int medicationId, bool taken) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(registerDoseUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["medicationId"] = medicationId;
    doc["taken"] = taken;
    
    String requestBody;
    serializeJson(doc, requestBody);
    
    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Dose registered:");
      Serial.println(response);
    } else {
      Serial.print("Error in POST request: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("Wi-Fi disconnected.");
  }
}
