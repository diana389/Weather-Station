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

#define BLUE_PIN 16   // GPIO pin for Red
#define GREEN_PIN 17  // GPIO pin for Green
#define RED_PIN 19    // GPIO pin for Blue

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

const char *ntpServer = "pool.ntp.org";
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

bool checkSensorData(sensors_event_t event, float humidity, float temperature) {
  if (event.pressure) {
    // Display the pressure
    Serial.print("Pressure: ");
    Serial.print(event.pressure);
    Serial.println(" hPa");

    // Display temperature
    float bmp_temperature;
    bmp.getTemperature(&bmp_temperature);
    Serial.print("BMP Temperature: ");
    Serial.print(bmp_temperature);
    Serial.println(" °C");

    // Calculate altitude (assuming sea level pressure = 1013.25 hPa)
    float seaLevelPressure = 1013.25;
    Serial.print("Altitude: ");
    Serial.print(bmp.pressureToAltitude(seaLevelPressure, event.pressure));
    Serial.println(" meters");
  } else {
    Serial.println(F("Failed to read from BMP sensor!"));
    return false;
  }

  // Check if the readings are valid
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return false;
  }

  // Print readings to Serial Monitor
  Serial.print(F("Humidity: "));
  Serial.print(humidity);
  Serial.print(F("%  Temperature: "));
  Serial.print(temperature);
  Serial.println(F("°C"));

  return true;
}

void fetchAndPrintErrorFlag() {
  if (!Firebase.ready() || !signupOK) {
    Serial.println("Firebase not ready or signup not completed.");
    return;
  }

  if (Firebase.RTDB.getJSON(&fbdo, "error/flag")) {
    FirebaseJson &json = fbdo.jsonObject();

    // Create FirebaseJsonData objects to store the extracted values
    FirebaseJsonData errorOccurredData;
    FirebaseJsonData messageData;

    // Extract the boolean and message
    if (json.get(errorOccurredData, "/errorOccurred") && json.get(messageData, "/message")) {
      // Retrieve the boolean and string from FirebaseJsonData
      bool errorOccurred = errorOccurredData.boolValue;
      String message = messageData.stringValue;

      // Print the boolean value and message
      Serial.print("Error Occurred: ");
      Serial.println(errorOccurred ? "true" : "false");
      Serial.print("Message: ");
      Serial.println(message);

      if (errorOccurred) {
        setColor(255, 0, 0);  // Red
      } else {
        setColor(0, 0, 0);  // Off (turn off the LED)
      }

    } else {
      Serial.println("Failed to extract data from JSON.");
    }
  } else {
    Serial.print("Failed to fetch error flag: ");
    Serial.println(fbdo.errorReason());
  }
}

void pushToFirebase(const String &path, const String &key, float value, const String &timestamp) {

  if (timestamp == "N/A") {
    Serial.println("Timestamp is invalid (N/A). Data not sent.");
    return;  // Exit the function if timestamp is invalid
  }

  FirebaseJson json;
  json.set(key, value);
  json.set("timestamp", timestamp);

  if (Firebase.RTDB.pushJSON(&fbdo, path, &json)) {
    Serial.println("Data sent successfully:");
    Serial.println(key + ": " + String(value));
    Serial.println("Timestamp: " + timestamp);
  } else {
    Serial.println("Failed to send data:");
    Serial.println(fbdo.errorReason());
  }
}

void setColor(int red, int green, int blue) {
  // Use PWM to control the brightness of each color
  analogWrite(RED_PIN, red);      // Set Red PWM
  analogWrite(GREEN_PIN, green);  // Set Green PWM
  analogWrite(BLUE_PIN, blue);    // Set Blue PWM
}


void setup() {
  Serial.begin(9600);

  // Initialize the RGB LED pins as output
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);

  // // Set PWM frequencies for each color (can be adjusted)
  // ledcSetup(0, 5000, 8);  // Channel 0, frequency = 5 kHz, resolution = 8-bit
  // ledcSetup(1, 5000, 8);  // Channel 1
  // ledcSetup(2, 5000, 8);  // Channel 2

  // // Attach the pins to the PWM channels
  // ledcAttachPin(RED_PIN, 0);
  // ledcAttachPin(GREEN_PIN, 1);
  // ledcAttachPin(BLUE_PIN, 2);

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

  // // Set colors by adjusting PWM values
  // setColor(255, 0, 0);  // Red
  // delay(5000);
  // setColor(0, 255, 0);  // Green
  // delay(5000);
  // setColor(0, 0, 255);  // Blue
  // delay(5000);
  // setColor(255, 255, 0);  // Yellow (Red + Green)
  // delay(5000);
  // setColor(0, 255, 255);  // Cyan (Green + Blue)
  // delay(5000);
  // setColor(255, 0, 255);  // Magenta (Red + Blue)
  // delay(5000);
  // setColor(255, 255, 255);  // White (Red + Green + Blue)
  // delay(5000);

  fetchAndPrintErrorFlag();

  sensors_event_t event;
  bmp.getEvent(&event);

  if (!Firebase.ready() || !signupOK || !(millis() - sendDataPrevMillis > 10000 || sendDataPrevMillis == 0)) {
    return;
  }

  sendDataPrevMillis = millis();
  String timestamp = getCurrentTime();

  Serial.println("timestamp " + timestamp);

  // Reading temperature and humidity
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  float pressure = event.pressure;

  if (!checkSensorData(event, humidity, temperature)) {
    return;
  }

  pushToFirebase("sensor_data/temperature", "temperature", temperature, timestamp);
  pushToFirebase("sensor_data/humidity", "humidity", humidity, timestamp);
  pushToFirebase("sensor_data/pressure", "pressure", pressure, timestamp);

  // // Write an Int number on the database path test/int
  // if (Firebase.RTDB.pushFloat(&fbdo, "test/humidity", humidity)) {
  //   Serial.println("PASSED PATH: " + fbdo.dataPath() + " TYPE: " + fbdo.dataType());
  // } else {
  //   Serial.println("FAILED");
  //   Serial.println("REASON: " + fbdo.errorReason());
  // }
  // count++;

  // // Write an Float number on the database path test/float
  // if (Firebase.RTDB.pushFloat(&fbdo, "test/temperature", temperature)) {
  //   Serial.println("PASSED PATH: " + fbdo.dataPath() + " TYPE: " + fbdo.dataType());
  // } else {
  //   Serial.println("FAILED");
  //   Serial.println("REASON: " + fbdo.errorReason());
  // }

  // // Write an Float number on the database path test/float
  // if (Firebase.RTDB.pushFloat(&fbdo, "test/pressure", pressure)) {
  //   Serial.println("PASSED PATH: " + fbdo.dataPath() + " TYPE: " + fbdo.dataType());
  // } else {
  //   Serial.println("FAILED");
  //   Serial.println("REASON: " + fbdo.errorReason());
  // }
}
