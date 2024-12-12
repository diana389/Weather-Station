# Introducere: Descriere generală a proiectului și obiectivele sale

Proiectul propus reprezintă o stație meteorologică de monitorizare a condițiilor ambientale, bazată pe ESP32 și utilizând senzori de temperatură, presiune și umiditate. Acest sistem va colecta și transmite datele în timp real într-o bază de date în cloud (Firebase) pentru a permite analiza evoluției acestora de-a lungul timpului. Obiectivele principale ale proiectului sunt următoarele:

- **Monitorizarea temperaturii și umidității**: Utilizarea unui senzor DHT11 pentru a măsura temperatura și umiditatea ambientală.
- **Monitorizarea presiunii**: Utilizarea unui senzor BMP180 pentru a măsura presiunea.
- **Transmiterea datelor**: Datele colectate vor fi trimise într-o bază de date Firebase, unde vor fi stocate și pot fi accesate pentru vizualizare și analiză.
- **Aplicație web**: Crearea unei aplicații web care va extrage datele din Firebase și va permite vizualizarea acestora sub formă de grafice, facilitând analiza evoluției condițiilor ambientale.
- **Feedback vizual cu LED RGB**: Utilizarea unui LED RGB care își schimbă culoarea în funcție de temperatura măsurată, oferind un feedback vizual instantaneu despre condițiile ambientale.
- **Dashboard**: Implementarea unui dashboard interactiv care va permite utilizatorilor să vizualizeze datele colectate de la senzori.
- **Notificări și alerte**: Sistemul va trimite notificări și alerte în funcție de analiza datelor colectate de la senzori. De exemplu, dacă temperatura depășește o valoare critică, utilizatorul va fi informat printr-o alertă în aplicație.
- **Interfață responsivă**: Aplicația web și dashboard-ul vor fi optimizate pentru a oferi o experiență de utilizare fluidă, asigurând o accesibilitate ușoară și un control intuitiv al sistemului.

Prin acest proiect, se dorește să se creeze o soluție eficientă și accesibilă pentru monitorizarea mediului înconjurător, cu aplicații în domenii precum agricultura de precizie, protecția mediului sau climatizarea spațiilor interioare.

---

# Arhitectură: Diagrama topologiei rețelei și protocoalele de comunicație utilizate

## Topologia rețelei

Topologia rețelei este una simplă, dar eficientă, în care fiecare componentă joacă un rol bine definit:

- **Senzorii** (DHT11 + BMP180) sunt conectați la ESP32, care colectează datele.
- **ESP32** se conectează la **WiFi** pentru a transmite datele către **Firebase**.
- **Aplicația web** va prelua datele din **Firebase** și le va vizualiza sub formă de grafice.

**Diagrama rețelei**:

`[Senzori DHT11 + BMP180]` ---> `[ESP32]` ---> `[WiFi]` ---> `[Firebase Database]` ---> `[Aplicație Web]`

## Protocoalele de comunicație

- **WiFi**: Utilizat pentru conectarea ESP32 la internet. Conexiunea se stabilește folosind un SSID și o parolă, iar ESP32 se conectează la rețeaua WiFi pentru a trimite date.
  
- **HTTP/S (via Firebase REST API)**: Utilizat pentru a trimite datele de la ESP32 către Firebase. De fiecare dată când datele sunt colectate de la senzor, acestea sunt trimise către Firebase pentru stocare.

- **Protocolul SSL/TLS**: Toate datele trimise de la ESP32 către Firebase vor fi criptate folosind SSL/TLS, asigurând o transmisie de date sigură și protejată împotriva accesului neautorizat.

## Componentele arhitecturii

- **Senzori**: 
  - **DHT11** - măsoară temperatura și umiditatea. Este conectat la ESP32 și citit periodic pentru a colecta datele de mediu.
  
- **Actuatori**: 
  - **LED RGB** - un actuator vizual care schimbă culoarea în funcție de temperatura citită de la senzorul DHT11. Acesta furnizează un feedback vizual imediat al condițiilor de mediu, ajutând utilizatorul să înțeleagă rapid schimbările de temperatură.
  
- **Aplicația de control**:
  - Aplicația web se conectează la Firebase pentru a prelua datele și le vizualizează sub formă de grafice, oferind utilizatorului o interfață prietenoasă pentru monitorizarea condițiilor ambientale și un control la distanță al dispozitivelor conectate.

  https://github.com/diana389/Weather-Station
