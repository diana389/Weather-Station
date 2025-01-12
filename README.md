# [`WEATHER STATION`](https://github.com/diana389/Weather-Station)


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

 # Implementare: Pașii de configurare a hardware-ului, software-ului, și sistemului de alertare și notificare.
 # Vizualizare și Procesare de Date: Explicarea metodei de procesare și afișare a datelor senzorilor într-o interfață intuitivă.
 # Securitate: Măsuri de securitate implementate (criptare și autentificare).
 # Provocări și Soluții: Probleme întâmpinate și soluțiile aplicate.
