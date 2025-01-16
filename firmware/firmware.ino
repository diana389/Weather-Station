#include <Adafruit_Sensor.h>
#include <Arduino.h>
#include <DHT.h>
#include <DHT_U.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <time.h>
#include <Wire.h>
#include <Adafruit_BMP085_U.h>

// Include token helper for Firebase
#include "addons/TokenHelper.h"
// Include RTDB helper for Firebase
#include "addons/RTDBHelper.h"

// WiFi credentials
#define WIFI_SSID "Marius"
#define WIFI_PASSWORD "Mariusboss"

// Firebase credentials
#define DATABASE_URL "https://weather-station-2bcc4-default-rtdb.europe-west1.firebasedatabase.app/"
#define API_KEY "AIzaSyAzcGVzPdhsAgmOIeSaaZy7hpBfesm6Igs"

// Define DHT pin and type
#define DHTPIN 32      // GPIO pin where the DHT11 is connected
#define DHTTYPE DHT11  // Define the type of DHT sensor

// Define RGB LED pins
#define BLUE_PIN 5    // GPIO pin for Red
#define GREEN_PIN 18  // GPIO pin for Green
#define RED_PIN 19    // GPIO pin for Blue

// Define pins for the temperature RGB LED
#define TEMP_BLUE_PIN 15   // GPIO pin for Blue temperature LED
#define TEMP_GREEN_PIN 16  // GPIO pin for Green temperature LED
#define TEMP_RED_PIN 17    // GPIO pin for Red temperature LED

// Initialize DHT sensor
DHT dht(DHTPIN, DHTTYPE);

// Initialize BMP085 sensor
Adafruit_BMP085_Unified bmp = Adafruit_BMP085_Unified(10085);

// Firebase objects
FirebaseData fbdo;      // Firebase data object
FirebaseAuth auth;      // Firebase authentication object
FirebaseConfig config;  // Firebase configuration object

unsigned long sendDataPrevMillis = 0;  // Variable to store the previous time data was sent
bool signupOK = false;                 // Flag to check if signup was successful

const char *ntpServer = "pool.ntp.org";  // NTP server for time synchronization
const long gmtOffset_sec = 0;            // Timezone offset in seconds
const int daylightOffset_sec = 3600;     // Daylight saving offset in seconds

// Function to get the current time
String getCurrentTime() {
  struct tm timeinfo;

  // Check if local time can be obtained
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return String("N/A");
  }

  // Return formatted time as string
  char timeString[20];
  strftime(timeString, sizeof(timeString), "%Y-%m-%d %H:%M:%S", &timeinfo);
  return String(timeString);
}

// Function to check sensor data validity
bool checkSensorData(sensors_event_t event, float humidity, float temperature) {
  // Check if pressure data is available
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

    // Print error message if BMP sensor fails
    Serial.println(F("Failed to read from BMP sensor!"));
    return false;
  }

  // // Check if humidity or temperature are invalid
  if (isnan(humidity) || isnan(temperature)) {

    // Print error message if DHT sensor fails
    Serial.println(F("Failed to read from DHT sensor!"));
    return false;
  }

  // Print reading
  Serial.print(F("Humidity: "));
  Serial.print(humidity);
  Serial.print(F("%  Temperature: "));
  Serial.print(temperature);
  Serial.println(F("°C"));

  return true;
}

// Function to fetch and print error flag from Firebase
void fetchAndPrintErrorFlag() {

  // Check if Firebase is ready and signup is successful
  if (!Firebase.ready() || !signupOK) {
    Serial.println("Firebase not ready or signup not completed.");
    return;
  }

  // Fetch error flag from Firebase
  if (Firebase.RTDB.getJSON(&fbdo, "error/flag")) {
    FirebaseJson &json = fbdo.jsonObject();

    // Create FirebaseJsonData objects to store the extracted values
    FirebaseJsonData errorOccurredData;
    FirebaseJsonData messageData;

    // Extract the boolean and message
    if (json.get(errorOccurredData, "/errorOccurred") && json.get(messageData, "/message")) {

      bool errorOccurred = errorOccurredData.boolValue;  // Get error occurred status
      String message = messageData.stringValue;          // Get message from JSON

      // Print the boolean value and message if an error occurred
      if (errorOccurred) {
        Serial.print("Error Occurred: ");
        Serial.println(errorOccurred ? "true" : "false");
        Serial.print("Message: ");
        Serial.println(message);

        // Set LED color to Red for alarm indication
        setColor(255, 0, 0);
      } else {

        // Turn off LED if no alarm was triggered
        setColor(0, 0, 0);
      }

    } else {

      // Print error message if JSON extraction fails
      Serial.println("Failed to extract data from JSON.");
    }
  } else {

    // Print error message if fetching fails
    Serial.print("Failed to fetch error flag: ");
    Serial.println(fbdo.errorReason());
  }
}

// Function to push data to Firebase
void pushToFirebase(const String &path, const String &key, float value, const String &timestamp) {

  // Check if timestamp is invalid
  if (timestamp == "N/A") {
    Serial.println("Timestamp is invalid (N/A). Data not sent.");
    return;  // Exit the function if timestamp is invalid
  }

  // Create JSON object for data
  FirebaseJson json;
  json.set(key, value);
  json.set("timestamp", timestamp);

  // Push JSON data to Firebase
  if (Firebase.RTDB.pushJSON(&fbdo, path, &json)) {
    Serial.println("Data sent successfully:");
    Serial.println(key + ": " + String(value));
    Serial.println("Timestamp: " + timestamp);
  } else {

    // Print error message if sending fails
    Serial.println("Failed to send data:");
    Serial.println(fbdo.errorReason());
  }
}

// Function to set RGB LED color
void setColor(int red, int green, int blue) {
  analogWrite(RED_PIN, red);
  analogWrite(GREEN_PIN, green);
  analogWrite(BLUE_PIN, blue);
}

// Function to set temperature RGB LED color
void setTemperatureColor(int red, int green, int blue) {
  analogWrite(TEMP_RED_PIN, red);
  analogWrite(TEMP_GREEN_PIN, green);
  analogWrite(TEMP_BLUE_PIN, blue);
}

// Function to determine RGB color based on temperature
void getTemperatureColor(float temperature, int &r, int &g, int &b) {
  if (temperature >= 30) {
    // Above 30°C, full Red
    r = 255;
    g = 0;
    b = 0;
  } else if (temperature >= 25) {
    // Between 25°C and 30°C (Yellow)
    r = 255;
    g = 255;
    b = 0;
  } else if (temperature >= 20) {
    // Between 20°C and 25°C (Green)
    r = 0;
    g = 255;
    b = 0;
  } else {
    // Below 20°C, full Blue
    r = 0;
    g = 0;
    b = 255;
  }
}

void setup() {
  Serial.begin(9600);

  // Initialize the RGB LED pins as output
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);

  // Initialize the temperature RGB LED pins as output
  pinMode(TEMP_RED_PIN, OUTPUT);
  pinMode(TEMP_GREEN_PIN, OUTPUT);
  pinMode(TEMP_BLUE_PIN, OUTPUT);

  // Configure time settings
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  Serial.println("Time synchronized!");

  // Check if BMP sensor initializes successfully
  if (!bmp.begin()) {
    Serial.println("Could not find a valid BMP180 sensor, check wiring!");
  }

  // Initialize DHT sensor
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

  // Attempt to sign up with Firebase
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("ok");

    // Set signup flag to true
    signupOK = true;
  } else {

    // Print error message if signup fails
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  // Set token status callback
  config.token_status_callback = tokenStatusCallback;


  // Initialize Firebase with config and auth
  Firebase.begin(&config, &auth);

  // Enable automatic reconnection to WiFi
  Firebase.reconnectWiFi(true);
}

void loop() {

  // Fetch and print error flag from Firebase
  fetchAndPrintErrorFlag();

  // Get event data from BMP sensor
  sensors_event_t event;
  bmp.getEvent(&event);

  // Check if Firebase is ready and if enough time has passed
  if (!Firebase.ready() || !signupOK || !(millis() - sendDataPrevMillis > 10000 || sendDataPrevMillis == 0)) {
    return;
  }

  // Update previous millis time and print current time
  sendDataPrevMillis = millis();
  String timestamp = getCurrentTime();
  Serial.println("timestamp " + timestamp);

  // Reading temperature, humidity and pressure
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  float pressure = event.pressure;

  // Check if sensor data is valid
  if (!checkSensorData(event, humidity, temperature)) {
    return;
  }

  // Set temperature LED color
  int r, g, b;
  getTemperatureColor(temperature, r, g, b);
  setTemperatureColor(r, g, b);
  Serial.println("r: " + String(r) + " g: " + String(g) + " b: " + String(b));

  // Push temperature data to Firebase
  pushToFirebase("sensor_data/temperature", "temperature", temperature, timestamp);
  // Push humidity data to Firebase
  pushToFirebase("sensor_data/humidity", "humidity", humidity, timestamp);
  // Push pressure data to Firebase
  pushToFirebase("sensor_data/pressure", "pressure", pressure, timestamp);
}
