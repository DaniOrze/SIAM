#ifndef WIFICONNECTION_H
#define WIFICONNECTION_H

#include <WiFi.h>

class WiFiConnection {
  public:
    WiFiConnection(const char* ssid, const char* password) {
      _ssid = ssid;
      _password = password;
    }
    
    void connect() {
      WiFi.begin(_ssid, _password);
      Serial.print("Conectando ao Wi-Fi...");
      while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
      }
      Serial.println("\nConectado!");
      Serial.print("Endereço IP: ");
      Serial.println(WiFi.localIP());
    }

  private:
    const char* _ssid;
    const char* _password;
};

#endif
