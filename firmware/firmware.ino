#include <Adafruit_Sensor.h>
#include <Arduino.h>
#include <DHT.h>
#include <DHT_U.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <time.h>
#include <Wire.h>
#include <Adafruit_BMP085_U.h>

//Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// WiFi credentials
#define WIFI_SSID "BOOM"
#define WIFI_PASSWORD "1234link.5678sys"

// Firebase credentials
#define DATABASE_URL "https://weather-station-2bcc4-default-rtdb.europe-west1.firebasedatabase.app/"
#define API_KEY "AIzaSyAzcGVzPdhsAgmOIeSaaZy7hpBfesm6Igs"

// Define DHT pin and type
#define DHTPIN 32  // GPIO pin where the DHT11 is connected
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

// Create an instance of the sensor
Adafruit_BMP085_Unified bmp = Adafruit_BMP085_Unified(10085);

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;

const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 0;         // Adjust for your timezone offset in seconds (e.g., GMT+1 = 3600)
const int daylightOffset_sec = 3600;  // Daylight saving offset in seconds (if applicable)

String getCurrentTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return String("N/A");
  }
  char timeString[20];
  strftime(timeString, sizeof(timeString), "%Y-%m-%d %H:%M:%S", &timeinfo);
  return String(timeString);
}


void setup() {
  Serial.begin(9600);

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  Serial.println("Time synchronized!");

  // Initialize the BMP180 sensor
  if (!bmp.begin()) {
    Serial.println("Could not find a valid BMP180 sensor, check wiring!");
  }

  Serial.println(F("DHT11 Sensor Test"));

  dht.begin();

  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");

  // Configure Firebase
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("ok");
    signupOK = true;
  } else {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback;  //see addons/TokenHelper.h

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  // Wait a few seconds between measurements
  delay(2000);

  sensors_event_t event;
  bmp.getEvent(&event);

  // Reading temperature and humidity
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  float pressure = event.pressure;

  if (event.pressure) {
    // Display the pressure
    Serial.print("Pressure: ");
    Serial.print(event.pressure);
    Serial.println(" hPa");

    // Display temperature
    float temperature;
    bmp.getTemperature(&temperature);
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" °C");

    // Calculate altitude (assuming sea level pressure = 1013.25 hPa)
    float seaLevelPressure = 1013.25;
    Serial.print("Altitude: ");
    Serial.print(bmp.pressureToAltitude(seaLevelPressure, event.pressure));
    Serial.println(" meters");
  } else {
    Serial.println(F("Failed to read from BMP sensor!"));
    return;
  }

  // Check if the readings are valid
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  // Print readings to Serial Monitor
  Serial.print(F("Humidity: "));
  Serial.print(humidity);
  Serial.print(F("%  Temperature: "));
  Serial.print(temperature);
  Serial.println(F("°C"));

  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 5000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();
    String timestamp = getCurrentTime();

    // Create a JSON object to include temperature, humidity, and timestamp
    FirebaseJson json;
    json.set("temperature", temperature);
    json.set("humidity", humidity);
    json.set("timestamp", timestamp);

    // // Push JSON data to Firebase
    // if (Firebase.RTDB.pushJSON(&fbdo, "/sensor_data", &json)) {
    //   Serial.println("Data sent successfully:");
    //   Serial.println("Temperature: " + String(temperature));
    //   Serial.println("Humidity: " + String(humidity));
    //   Serial.println("Timestamp: " + timestamp);
    // } else {
    //   Serial.println("Failed to send data:");
    //   Serial.println(fbdo.errorReason());
    // }

    // Write an Int number on the database path test/int
    if (Firebase.RTDB.pushFloat(&fbdo, "test/humidity", humidity)) {
      Serial.println("PASSED PATH: " + fbdo.dataPath() + " TYPE: " + fbdo.dataType());
    } else {
      Serial.println("FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }
    count++;

    // Write an Float number on the database path test/float
    if (Firebase.RTDB.pushFloat(&fbdo, "test/temperature", temperature)) {
      Serial.println("PASSED PATH: " + fbdo.dataPath() + " TYPE: " + fbdo.dataType());
    } else {
      Serial.println("FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }

    // Write an Float number on the database path test/float
    if (Firebase.RTDB.pushFloat(&fbdo, "test/pressure", pressure)) {
      Serial.println("PASSED PATH: " + fbdo.dataPath() + " TYPE: " + fbdo.dataType());
    } else {
      Serial.println("FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }
  }
}
