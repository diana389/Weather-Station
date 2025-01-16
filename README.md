# [`WEATHER STATION`](https://github.com/diana389/Weather-Station)

# Setup Instructions

## Prerequisites
- **Arduino IDE** (1.8.19+ or 2.x).
- USB driver for ESP32: [CP210x_Windows_Drivers](https://www.silabs.com/documents/public/software/CP210x_Windows_Drivers.zip).

---

## 1. Install ESP32 Arduino Core
1. Open Arduino IDE, go to **File > Preferences**.
2. Add this URL under **Additional Boards Manager URLs**:
https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
4. Go to **Tools > Board > Boards Manager**, search for **ESP32**, and install **esp32 by Espressif Systems**.
5. Select **ESP32 Dev Module** in **Tools > Board**.

---

## 2. Install Required Libraries
1. Open **Sketch > Include Library > Manage Libraries...**.
2. Install the following libraries:
- **Adafruit Unified Sensor**
- **DHT sensor library**
- **Adafruit BMP085 Unified**
3. Download and add the **Firebase ESP Client** library from [GitHub](https://github.com/mobizt/Firebase-ESP-Client):
- Go to **Sketch > Include Library > Add .ZIP Library...** and select the downloaded ZIP file.

---

## 3. Upload the Code
1. Open the `firmware.ino` file.
2. Select the correct COM port in **Tools > Port**.
3. Click **Upload** to flash the code to the ESP32.

---

## Notes
- Set your Wi-Fi and Firebase credentials in the `firmware.ino` file.
