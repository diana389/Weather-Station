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


# Introducere: Descriere generală a proiectului și obiectivele sale

Proiectul propus reprezintă o stație meteorologică de monitorizare a condițiilor ambientale, bazată pe `ESP32` și utilizând senzori de `temperatură`, `presiune` și `umiditate`. Acest sistem va colecta și transmite datele în timp real într-o bază de date în cloud (`Firebase`) pentru a permite analiza evoluției acestora de-a lungul timpului. Obiectivele principale ale proiectului sunt următoarele:

- **Monitorizarea temperaturii și umidității**: Utilizarea unui senzor DHT11 pentru a măsura temperatura și umiditatea ambientală.
- **Monitorizarea presiunii**: Utilizarea unui senzor BMP180 pentru a măsura presiunea.
- **Transmiterea datelor**: Datele colectate vor fi trimise într-o bază de date Firebase, unde vor fi stocate și pot fi accesate pentru vizualizare și analiză.
- **Aplicație web**: Crearea unei aplicații web care va extrage datele din Firebase și va permite vizualizarea acestora sub formă de grafice, facilitând analiza evoluției condițiilor ambientale.
- **Feedback vizual cu LED RGB**: Utilizarea unui LED RGB care își schimbă culoarea în funcție de temperatura măsurată, oferind un feedback vizual instantaneu despre condițiile ambientale.
- **Dashboard**: Implementarea unui dashboard interactiv care va permite utilizatorilor să vizualizeze datele colectate de la senzori.
- **Notificări și alerte**: Sistemul va trimite notificări și alerte în funcție de analiza datelor colectate de la senzori. De exemplu, dacă temperatura depășește o valoare critică, utilizatorul va fi informat printr-o alertă în aplicație și prin aprinderea unui LED RGB.
- **Interfață responsivă**: Aplicația web și dashboard-ul vor fi optimizate pentru a oferi o experiență de utilizare fluidă, asigurând o accesibilitate ușoară și un control intuitiv al sistemului.

---

# Arhitectură: Diagrama topologiei rețelei și protocoalele de comunicație utilizate

## Topologia rețelei

- **Senzorii** (DHT11 + BMP180) sunt conectați la **ESP32**, care colectează datele de temperatură, umiditate și presiune.
- **ESP32** se conectează la **WiFi** pentru a transmite datele către **Firebase**.
- **Aplicația web**:
  - Preia datele din **Firebase** și le vizualizează sub formă de grafice, facilitând analiza evoluției condițiilor ambientale.
  - Permite setarea unui flag pentru alarmă în **Firebase**, indicând o condiție critică.
  - În funcție de valoarea temperaturii, aplicația web va actualiza și valoarea culorii LED-ului RGB în **Firebase**.
- **RGB LED-uri** conectate la ESP32:
  - **LED-ul de alarmă** se va aprinde în funcție de flagul de alarmă setat în Firebase.
  - **LED-ul RGB** care indică temperatura va ajusta culoarea în funcție de temperatura măsurată (ex. roșu pentru temperaturi ridicate, albastru pentru temperaturi scăzute).

**Diagrama rețelei**:

![pr](https://github.com/user-attachments/assets/f2465408-d28c-48f9-a751-77e92e40a786)

## Protocoalele de comunicație

- **WiFi**: Utilizat pentru conectarea ESP32 la internet. Conexiunea se stabilește folosind un SSID și o parolă, iar ESP32 se conectează la rețeaua WiFi pentru a trimite date.
  
- **HTTP/S (Firebase REST API)**: Utilizat pentru a trimite datele de la ESP32 către Firebase. De fiecare dată când datele sunt colectate de la senzor, acestea sunt trimise către Firebase pentru stocare.

- **Protocolul SSL/TLS**: Toate datele trimise de la ESP32 către Firebase vor fi criptate folosind SSL/TLS, asigurând o transmisie de date sigură și protejată împotriva accesului neautorizat.

## Componentele arhitecturii

- **Senzori**: 
  - **DHT11** - măsoară temperatura și umiditatea. Este conectat la ESP32 și citit periodic pentru a colecta datele de mediu.
  - **BMP180** - măsoară presiunea atmosferică. Este conectat la ESP32 și furnizează informații suplimentare pentru analiza condițiilor ambientale.
  
- **Actuatori**:
  - **LED RGB** - un actuator vizual care schimbă culoarea în funcție de temperatura citită de la senzorul DHT11. Acesta furnizează un feedback vizual imediat al condițiilor de mediu, ajutând utilizatorul să înțeleagă rapid schimbările de temperatură. De exemplu, poate deveni roșu pentru temperaturi ridicate sau albastru pentru temperaturi scăzute.
  - **LED de alarmă** - un actuator care se aprinde sau schimbă culoarea atunci când temperatura atinge o valoare critică. Acesta este controlat printr-un flag în Firebase setat de aplicația web.

- **Aplicația de control**:
  - Aplicația web se conectează la **Firebase** pentru a prelua datele de la senzori (temperatură, umiditate, presiune) și le vizualizează sub formă de grafice, oferind utilizatorului o interfață prietenoasă pentru monitorizarea condițiilor ambientale.
  - Aplicația web permite utilizatorului să seteze un flag pentru alarmă în Firebase, care controlează aprinderea **LED-ului de alarmă**.
  - De asemenea, aplicația ajustează valoarea culorii pentru **LED-ul RGB** în funcție de temperatura măsurată și o actualizează în **Firebase**.

# Implementare: Pașii de configurare a hardware-ului, software-ului, și sistemului de alertare și notificare

## Configurarea hardware-ului:
- **ESP32**: Platforma principală pentru colectarea datelor de la senzorii conectați și trimiterea acestora către Firebase.
- **Senzori**:
  - **DHT11**: Măsurarea temperaturii și umidității.
  - **BMP180**: Măsurarea presiunii atmosferice.
- **LED RGB**: 
  - Conectat la pinii GPIO ai ESP32 pentru a oferi feedback vizual asupra condițiilor ambientale.
  - Fiecare culoare (roșu, verde, albastru) este controlată prin PWM.

## Configurarea software-ului:
### Librării utilizate:
- **DHT.h** și **DHT_U.h**: Pentru citirea datelor de la senzorul DHT11.
- **WiFi.h**: Pentru conectarea ESP32 la rețeaua WiFi.
- **Firebase_ESP_Client.h**: Pentru interacțiunea cu Firebase.
- **Wire.h** și **Adafruit_BMP085_U.h**: Pentru citirea presiunii atmosferice de la senzorul BMP180.

### Conexiune WiFi:
- ESP32 se conectează la o rețea WiFi specificată prin SSID și parolă.

### Configurare Firebase:
- Accesul la datele din Firebase este realizat prin configurarea unui API Key și URL-ul bazei de date.

### Sincronizarea timpului:
- Timpul este sincronizat utilizând un server NTP.

### Sistem de alertă și notificare:
- Un sistem de alertă este configurat astfel încât, în cazul unui senzor care depășește un anumit prag, o notificare este trimisă utilizatorului prin intermediul culorii LED-ului RGB sau unui semnal acustic.
- Datele sunt trimise către Firebase cu un timp de trimitere verificat periodic pentru a evita o suprasolicitare a bazei de date.

# Vizualizare și Procesare de Date: Explicarea metodei de procesare și afișare a datelor senzorilor într-o interfață intuitivă
- Datele colectate de la senzorii DHT11 și BMP180 sunt procesate și trimise către Firebase, cu un timestamp asociat, pentru a fi vizualizate într-o aplicație web sau mobilă.
- Interfața va afișa informații despre temperatura, umiditatea și presiunea atmosferică într-un format ușor de înțeles, iar feedback-ul vizual (prin LED RGB) va indica starea curentă a senzorilor.

# Securitate: Măsuri de securitate implementate
1. **Criptare**:
   - Toate datele trimise de ESP32 către Firebase sunt criptate folosind **SSL/TLS**, asigurând astfel o transmisie sigură și protejată împotriva accesului neautorizat.
   
2. **Autentificare**:
   - Conexiunea la Firebase necesită autentificare utilizând un **API key** valid pentru accesul la baza de date.

# Provocări și Soluții: Probleme întâmpinate și soluțiile aplicate

## Probleme întâmpinate:
1. **Conectivitate WiFi instabilă**:
   - Pierderea conexiunii WiFi a dus la întreruperea transmisiei datelor către Firebase.
   
2. **Citirea incorectă a datelor de la senzori (DHT11, BMP180)**:
   - Valorile citite de la senzori erau adesea invalide, ceea ce afecta acuratețea datelor trimise.
   
3. **Nestăpânirea tehnologiilor web**:
   - Dificultăți în utilizarea unor tehnologii web avansate pentru vizualizarea și procesarea datelor senzorilor.

## Soluții aplicate:
1. **Conectivitate WiFi**:
   - Utilizarea unui cod repetitiv pentru a reconecta ESP32 la WiFi în cazul pierderii conexiunii, asigurându-se astfel o conectivitate constantă.

2. **Citirea datelor senzorilor**:
   - Implementarea unor verificări suplimentare pentru validarea datelor de la senzori înainte de trimiterea acestora către Firebase. 
   - În cazul în care datele sunt invalide (de exemplu, temperatura sau umiditatea citite sunt `NaN`), sistemul va afișa un mesaj de eroare și va evita trimiterea datelor incorecte.

3. **Nestăpânirea tehnologiilor web**:
   - Documentarea pe internet și urmarea unor tutoriale.

