
let glob_server = 1;                        // von welchen Server werden die Jobs-Daten geholt  -  0 = http://127.0.0.1:5000     oder   1 = https://search.pythonanywhere.com

let glob_user_id = 0;                       // id vom aktuell eingeloggten User 
let glob_email = "";                        // email Adresse vom aktuell eingeloggten User
let glob_access_token = "";
let glob_jobs_server = "http://127.0.0.1:5000";    // default Wert
let glob_user_server = "http://127.0.0.1:5000";     // default Wert
let glob_user_rolle = 0;                    // 0 = gast(nicht eingeloggt), 1 = eingeloggt, 90 = Admin
let glob_favoriten = [];                    // Liste mit den Jobs, die als Favoriten gekennzeichnet sind
let glob_freunde = [];                      // Liste mit den Freunden
let glob_jobalarm = [];                     // Liste mit den Job Alarme
let glob_jobs = [];
let glob_job_id_w = "";                      // job_id beim Weiterleiten an Freunde
let glob_kz_f;                               // 1=FreundeListe für die Verwaltung     2=FreundeListe für Job-Weiterleiten
let selectedFreundeIndex = null;
let selectedJobalarmIndex = null
let werbungs_intervall_off = 3;                // nach wieviel Jobs wird Werbung angezeigt - nicht angemelet
let werbungs_intervall_on = 6;                 // nach wieviel Jobs wird Werbung angezeigt - angemldet
let werbungs_intervall_pay = 0;                // nach wieviel Jobs wird Werbung angezeigt - bezahlt
let werbungs_intervall = werbungs_intervall_off;  // default Wert
let openWindows = [];                         // Liste der geöffneten Fenster 
let map;                                      // Globale Variable für die Karte
let mapInitialized = false;                   // Flag, um zu überprüfen, ob die Karte bereits initialisiert wurde

    
// Disply Größe vim iphon 14       844/390

//  Funktion zum Anzeigen von Menüpunkte
function configureMenuBasedOnRole() {
    //document.getElementById("size").innerHTML = screen.height + " / " + screen.width
   
    // Server Auswahl
    if (glob_server == 0) {glob_jobs_server = "http://127.0.0.1:5000";}     // von welchen Server werden die Jobs-Daten geholt  -  http://127.0.0.1:5000     oder    https://search.pythonanywhere.com
    if (glob_server == 0) {glob_user_server = "http://127.0.0.1:5000";}     // von welchen Server werden die User-Daten geholt  -  http://127.0.0.1:5000     oder    https://search.pythonanywhere.com
    if (glob_server == 1) {glob_jobs_server = "https://search.pythonanywhere.com";}     // von welchen Server werden die Jobs-Daten geholt  -  http://127.0.0.1:5000     oder    https://search.pythonanywhere.com
    if (glob_server == 1) {glob_user_server = "https://search.pythonanywhere.com"}     // von welchen Server werden die User-Daten geholt  -  http://127.0.0.1:5000     oder    https://search.pythonanywhere.com

     // Login 
    const m_login = document.getElementById("m_login");
    if (glob_user_rolle == 1) {m_login.classList.add("hidden");}    // Element vollständig ausblenden
    if (glob_user_rolle == 0) {m_login.classList.remove("hidden")}

    // Registrieren
    const m_registrieren = document.getElementById("m_registrieren");
    if (glob_user_rolle == 1) {m_registrieren.classList.add("hidden");}    // Element vollständig ausblenden
    if (glob_user_rolle == 0) {m_registrieren.classList.remove("hidden")}

    // Name ändern 
    const m_name_aendern = document.getElementById("m_name_aendern");
    if (glob_user_rolle == 0) {m_name_aendern.classList.add("hidden");}    // Element vollständig ausblenden
    if (glob_user_rolle == 1) {m_name_aendern.classList.remove("hidden")}

    // Passwort ändern
    const m_pw_aendern = document.getElementById("m_pw_aendern");
    if (glob_user_rolle == 0) {m_pw_aendern.classList.add("hidden");}    // Element vollständig ausblenden
    if (glob_user_rolle == 1) {m_pw_aendern.classList.remove("hidden")}

    // Favoriten anzeigen
    const m_favoriten_anzeigen = document.getElementById("m_favoriten_anzeigen");
    if (glob_user_rolle == 0) {m_favoriten_anzeigen.classList.add("hidden");}    // Element vollständig ausblenden
    if (glob_user_rolle == 1) {m_favoriten_anzeigen.classList.remove("hidden")};

    // Freunde verwalten
    const m_freunde_verwalten = document.getElementById("m_freunde_verwalten");
    if (glob_user_rolle == 0) {m_freunde_verwalten.classList.add("hidden");}    // Element vollständig ausblenden
    if (glob_user_rolle == 1) {m_freunde_verwalten.classList.remove("hidden")};

    // Jobalarm verwalten
    const m_jobalarm_verwalten = document.getElementById("m_jobalarm_verwalten");
    if (glob_user_rolle == 0) {m_jobalarm_verwalten.classList.add("hidden");}    // Element vollständig ausblenden
    if (glob_user_rolle == 1) {m_jobalarm_verwalten.classList.remove("hidden")};

    // Logout
    const m_logout = document.getElementById("m_logout");
    if (glob_user_rolle == 0) {m_logout.classList.add("hidden");}    // Element vollständig ausblenden
    if (glob_user_rolle == 1) {m_logout.classList.remove("hidden")}

    // Karte ausblenden
    //document.getElementById('map-container').classList.remove('active-map');
    //if (glob_user_rolle == 0) {m_karte.classList.add("activ-map");}    // Element vollständig ausblenden
    //if (glob_user_rolle == 1) {m_karte.classList.remove("activ-map")}
    // Job-Karten ausblenden
    //document.getElementById('job-results').classList.remove('active-jobs');
}
//  Funktion zum Öffnen von Eingabefenster
function openWindow(windowId, focus) {
    const element = document.getElementById(windowId);

    closeAllWindowsExceptMain();               // Alle geöffneten Fenster schließen
    
    if (element) {
        element.style.display = 'block'; // Fenster anzeigen
        element.reset();

        const focusElement = document.getElementById(focus);   // Versuchen, das Eingabefeld mit der übergebenen focus-ID zu fokussieren
        if (focusElement) {focusElement.focus();} 
        else {console.log(`Eingabefeld mit ID "${focus}" nicht gefunden.`);}
        
        openWindows.push(windowId);                // zur Liste der offenen Fenster hinzufügen
        hamburgerClose();

        if (windowId == "freunde-form") {
            glob_kz_f=1;
            anzeigenFreunde();}    // nachdem das Fenster 'Freunde verwalten' aufgegangen ist, die bestehenden Freunde anzeigen
       
        if (windowId == "weiterleiten-form") {
            glob_kz_f=2;
            anzeigenFreunde();}    // nachdem das Fenster 'Weiterleiten' aufgegangen ist, die bestehenden Freunde anzeigen

        if (windowId == "jobalarm-form") {
            anzeigenJobalarm();}    // nachdem das Fenster 'Jobalarm' aufgegangen ist, die bestehenden Alarme anzeigen


    } else {
        console.log(`Fenster mit ID "${windowId}" nicht gefunden.`);
      }
}
//  Funktion zum Schließen von Eingabefenster
function closeWindow(windowId) {
    const element = document.getElementById(windowId);
    if (element) {
        element.style.display = 'none'; // Fenster verstecken
    } else {
        console.log(`Fenster mit ID "${windowId}" nicht gefunden.`);
      }
}
// Funktion zum Schließen des Hamburger-Menüs
function hamburgerClose() {
    const menuToggle = document.getElementById('menu-toggle');
    menuToggle.checked = false; // Checkbox deaktivieren, um das Menü zu schließen
    
}
// Funktion zum Schließen aller geöffneten Fenster außer dem Hauptfenster
function closeAllWindowsExceptMain() {
    openWindows.forEach(win => {
        if (win && !win.closed) {closeWindow(win);}
    });
    openWindows = [];      // Leere die Liste der geöffneten Fenster
}
// Event-Listener 
document.getElementById('menu-toggle').addEventListener('click', function(event) {event.stopPropagation();}); // Verhindert, dass das Click-Event auf das Dokument übertragen wird// 
document.getElementById('search-jobs-btn').addEventListener('click', fetchSearch2);
//document.getElementById('hcenter-btn').addEventListener('click', anzeigenMap());

// Funktion für das Login
async function login() {
    
    geodatenAuslesen()  // die Geodaten werden aktuell nicht gebraucht - vielleicht später einmal 
    
    glob_jobs = ""
    const jobResults = document.getElementById('job-results');
    jobResults.innerHTML = ''; // Bestehende Jobs löschen

    const email = document.getElementById('email').value;
    const passwort = document.getElementById('passwort').value;

    try {
        document.getElementById("login-fehler").innerHTML = "";

        apiUrl = glob_user_server + '/user/login'
        console.log(' login - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-cache'},
            body: JSON.stringify({email, passwort}),
        }
        const response = await fetch(apiUrl, fetchHead);
        const responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ['message']);}    // wenn ein nicht OK zurückkommt, wird eine Fehler generiert, weiter bei catch
        
        glob_user_id = responseJ['user_id']
        glob_access_token = responseJ['access_token']
        glob_email = email;
        glob_user_rolle = 1;        // 0 = nicht eingeloggt  1 = eingeloggt

        document.getElementById("current-user").innerHTML = responseJ['name'];   // User Name anzeigen
        configureMenuBasedOnRole();                                              // Menu neu aufbauen
        closeWindow('login-form');                                               // Login Fenster schließen
        favoritenGet();                                                          // Favoriten einlesen
    } 
    catch (error) {
        document.getElementById("login-fehler").innerHTML = error.message;
        console.log('Fehler beim Login:', error.message);
    }
}
// Funktion für Passwort vergessen/rücksetzen
async function pwrueck() {
    
    const email = document.getElementById('email').value;

    try {
        document.getElementById("login-fehler").innerHTML = "";

        apiUrl = glob_user_server + '/user/pwrueck';
        console.log(' login - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email}),
        }
        const response = await fetch(apiUrl, fetchHead);
        const responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ[0]['message']);}    // wenn ein nicht OK zurückkommt, wird eine Fehler generiert, weiter bei catch
        
        document.getElementById("login-fehler").innerHTML = "Sie haben per E-Mail ihr neues Passwort erhalten.";
    } 
    catch (error) {
        document.getElementById("login-fehler").innerHTML = error.message;
        console.log('Fehler beim Login:', error.message);
    }
}
// Funktion für das Logout
async function logout() {
    glob_user_id = ""
    glob_access_token = ""
    glob_liste_favoriten = ""
    glob_email = "";
    glob_user_rolle = 0;

    const jobResults = document.getElementById('job-results');
    jobResults.innerHTML = ''; // Bestehende Jobs löschen

    configureMenuBasedOnRole();    //Menu neu aufbauen
    
    document.getElementById("current-user").innerHTML = "";   // User Name anzeigen
    hamburgerClose();  // Menue Fenster schließen
}
// Funktion für die Registrierung
async function registrieren() {
    const email = document.getElementById('register-email').value;
    const name = document.getElementById('register-name').value;
    const passwort = document.getElementById('register-passwort').value;
    const passwort1 = document.getElementById('register-passwort1').value;
    try {
        document.getElementById('register-fehler').innerHTML = "";

        apiUrl = glob_user_server + '/user/registrieren';
        console.log('registrieren - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({email, name, passwort, passwort1}),}
    
        const response = await fetch(apiUrl, fetchHead);
        const responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ['message']);} // wenn ein Feheler (nicht OK) zurückkommt, wird eine Fehler generiert, weiter bei catch

        // wenn kein Feher zurückkommt: 
        document.getElementById('register-fehler').innerHTML = 'Registrierung ist OK - weiter mit dem Login';
    } 
    catch (error) {
        document.getElementById('register-fehler').innerHTML = error.message;
        console.log('Fehler bei der Registrierung', error.message);}
}
// Funktion für updat Name
async function update_name() {    
    email = glob_email
    const name = document.getElementById('update-name').value;

    try {
        document.getElementById("update_name-fehler").innerHTML = "";

        if (name == "") {throw new Error("Name darf nicht leer sein");}       //  wenn name = blank Fehlermeldung

        apiUrl = glob_user_server + '/user/updatename';        
        console.log(' Update Name - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, name}),
        }
        const response = await fetch(apiUrl, fetchHead);
        const responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ['message']);} // wenn ein Feheler (nicht OK) zurückkommt, wird eine Fehler generiert, weiter bei catch

        document.getElementById("current-user").innerHTML = name;   // User Name anzeigen
        
        closeWindow('update_name-form')        // hideLogin() Fenster schließen
    } 
    catch (error) {
        document.getElementById("update_name-fehler").innerHTML = error.message;
        console.log('Fehler beim Update Namen:', error.message);
    }
}
// Funktion für update Passwort
async function update_passwort() {    
    email = glob_email
    const passwortA = document.getElementById('update-passwortA').value;
    const passwortN = document.getElementById('update-passwortN').value;

    try {
        document.getElementById("update_pw-fehler").innerHTML = "";

        if (passwortA == "") {throw new Error("Passwort alt darf nicht leer sein");}       //  wenn name = blank Fehlermeldung
        if (passwortN == "") {throw new Error("Passwort neu darf nicht leer sein");}       //  wenn name = blank Fehlermeldung

        apiUrl = glob_user_server + '/user/updatepasswort';        
        console.log(' Update Passwort - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, passwortA, passwortN}),
        }
        const response = await fetch(apiUrl, fetchHead);
        const responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ['message']);} // wenn ein nicht OK zurückkommt, wird eine Fehler generiert, weiter bei catch
        
        closeWindow('update_pw-form')        // hideLogin()  // Login Fenster schließen
    } 
    catch (error) {
        document.getElementById("update_pw-fehler").innerHTML = error.message;
        console.log('Fehler beim Update Passwort:', error.message);
    }
}
// Funktion zum Abrufen der Jobs mit Übergabe Ort und Jobbezeichnung     -     ohne User Anmeldung
async function fetchSearch2() {
    const job_ort = document.getElementById('job-ort').value;
    const job_bezeichnung = document.getElementById('job-bezeichnung').value;
    const umkreis = document.getElementById('umkreis').value;

    if (job_ort == "" && job_bezeichnung == "") {alert("Bitte Job / Firma oder Ort eingeben!"); return;}  // wenn Ort oder Jobbezeichnung leer ist, dann Fehlermeldung    

    try {
        apiUrl = glob_jobs_server + `/jobs/search2?job_ort=${encodeURIComponent(job_ort)}&job_bezeichnung=${encodeURIComponent(job_bezeichnung)}&umkreis=${encodeURIComponent(umkreis)}`;
        console.log('Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        }
        const response = await fetch(apiUrl, fetchHead);
        const responseJ = await response.json();
        
        if (responseJ['status'] > 200) {
            throw new Error(responseJ['message']);} // wenn ein Feheler (nicht OK) zurückkommt, wird eine Fehler generiert, weiter bei catch

        glob_jobs = responseJ['data'];              // Jobs in eine Variable auslese
        
        await favoritenGet();
        aufbereitenJobkarten(glob_jobs);
        displayJobKarten(glob_jobs);
        füllenMap(glob_jobs);

    } catch (error) {
        console.error('Fehler beim Abrufen der Jobs vom Server (fetchSearch2): ', error.message);
    }
}
// Funktion zum Anzeigen von Jobs in Kästchen mit Buttons
function displayJobKarten() {
    document.getElementById('map-container').classList.remove('active-map');
    document.getElementById('job-results').classList.add('active-jobs');
    document.getElementById('id-h-btn-map').innerHTML = 'Karte';
}
// JobContainer mit JobKarten füllen/aufbereiten
function aufbereitenJobkarten(jobs) { 
    
    try {
        job_count = jobs.length;
        // Erstelle ein Set, um die Portale zu speichern
        const uniquePortals = new Set(jobs.map(job => job.quelle));    
        portal_count = uniquePortals.size;  // Anzahl der verschiedenen Portale

        document.querySelector('.jobs-count').textContent = job_count;
        document.querySelector('.portals-count').textContent = portal_count;
        document.getElementById('results-info').style.display = 'inline';

        const jobResults = document.getElementById('job-results');
        jobResults.innerHTML = ''; // Bestehende Jobs löschen
        
        z1_werbung = 0;  // Zähler für den Werbungs-Intervall
        z2_werbung = 0;  // Zähler für die Werbungsauswahl  

        jobs.forEach(job => {
            z1_werbung = z1_werbung + 1 
            z1_werbung = displayWerbung(z1_werbung);  // Werbung anzeigen   

            link2 = "", quelle2 = "", id2 = 0;
            link3 = "", quelle3 = "", id3 = 0;
            link4 = "", quelle4 = "", id4 = 0;
            if (job.detail2) {
                // Den String in ein JavaScript-Array parsen
                let parsedArray = JSON.parse(job.detail2.replace(/'/g, '"')); // Ersetze Single-Quotes durch Double-Quotes für gültiges JSON
                [id2, quelle2, link2] = parsedArray[0];  // Extrahiere die Werte aus dem Array
                len1 = parsedArray.length
                    if (parsedArray.length > 1) {
                        [id3, quelle3, link3] = parsedArray[1];  // Extrahiere die Werte aus dem Array
                    } 
                    if (parsedArray.length > 2) {
                        [id4, quelle4, link4] = parsedArray[1];  // Extrahiere die Werte aus dem Array
                    } 
            }
            const [year, month, day] = job.job_datum.split(".");
            const formattedDate = `${day}.${month}.${year}`;

            const jobDiv = document.createElement('div');
            jobDiv.classList.add('job-card');
            jobDiv.innerHTML = `
                <div class="jc-title">${job.job_bezeichnung}</div>
                <div class="jc-zeile2">
                    <a class="jc-job_firma">${job.job_firma} - </a>
                    <a class="jc-job_adresse">${job.job_firma_adresse}</a>   
                </div>
                <div class="jc-zeile3">
                    <a class="jc-job_datum">${formattedDate}</a>
                    <button class="jc-favoriten-button off" onclick="toggleFavorit(this)" data-job-id="${job.key_id}">&#9733;</button></a>
                    <button class="jc-weiterleiten-button" onclick="weiterleiten(this)" data-job-id="${job.key_id}">&#187;</button>
                    <a href="${job.job_link}" target="_blank" class="jc-job-link">${job.quelle}</a>
                    <a href="${link2}" target="_blank" class="jc-job-link">${quelle2}</a>
                    <a href="${link3}" target="_blank" class="jc-job-link">${quelle3}</a>
                    <a href="${link4}" target="_blank" class="jc-job-link">${quelle4}</a>
                </div>
            `;
            const button = jobDiv.querySelector('.jc-favoriten-button');
            
            jobResults.appendChild(jobDiv);

            if (glob_favoriten && job.key_id && Object.values(glob_favoriten).some(fav => fav.fav_job_id === job.key_id)    // Nachschaue ob job_id als Favorit gespeichert ist.
            ) {
                button.classList.remove('off');       // Favboriten Button off
                button.classList.add('on');           // Favboriten Button on
            }
        });
    } catch (error) {
        console.error('Fehler beim Abrufen der Jobs:', error); 
        //const jobResults = document.getElementById('job-results');
        //jobResults.innerHTML = '<p class="error-message">Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.</p>';   
    }
}
// Werbebeiträge in den JobContainer eintragen
function displayWerbung(z1_werbung) {
    if (glob_user_rolle == 0) {werbungs_intervall = werbungs_intervall_off;}  // Werbung nur für nicht angemeldete User
    if (glob_user_rolle == 1) {werbungs_intervall = werbungs_intervall_on;}   // Werbung nur für angemeldete User
    
    if (z1_werbung < werbungs_intervall) {return(z1_werbung);}  // Werbung nur nach x Jobs anzeigen

    z2_werbung = z2_werbung + 1;     // welche Werbung soll angezeigt werden
    const jobResults = document.getElementById('job-results');
    const jobDiv = document.createElement('div');
    jobDiv.classList.add('werbung-card');
    jobDiv.innerHTML = `
        <div class="werbung-card">
            <img src="./werbung/werbung${z2_werbung}.jpg" alt="Werbung Bild"> 
        </div>`; 

    jobResults.appendChild(jobDiv);
    z1_werbung = 1;

    if (z2_werbung > 4) {z2_werbung = 0;}  // es gibt nur 4 Werbungen

    return(z1_werbung);
}
// Hilfsfunktion: Prüfen, ob der Job ein Favorit ist
function isJobFavorite(jobId) {
    if (!glob_favoriten || !jobId) return false;
    return Object.values(glob_favoriten).some(fav => fav.fav_job_id === jobId);
}
// Funktion für den Favoriten-Stern   ON - OFF
async function toggleFavorit(button) {

    const jobId = button.getAttribute('data-job-id');

    if (button.classList.contains('off')) {
        let response = await favoritOn(jobId);
        if (response == "nok"){return;}    /* es ist ein Fehler eingetreten */

        button.classList.remove('off');
        button.classList.add('on');

    } else {
        let response = await favoritOff(jobId);
        if (response == "nok"){return;}    /* es ist ein Fehler eingetreten */

        button.classList.remove('on');
        button.classList.add('off');
    }
}
// Funktion für favoriten ON
async function favoritOn(jobid) {    
    try {
        if (glob_user_rolle == 0) {
            alert('Für diese Funktion musst du eingeloggt sein!');
            throw new Error("Für diese Funktion musst du eingeloggt sein!");}     

        apiUrl = glob_jobs_server + '/favoriten/on';        
        console.log(' Favoriten ON - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({glob_user_id, jobid}),
        }
        const response = await fetch(apiUrl, fetchHead);
        const responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ['message']);} // wenn ein Feheler (nicht OK) zurückkommt, wird eine Fehler generiert, weiter bei catch
        
        return 'ok';
    } 
    catch (error) {
        /*document.getElementById("update_name-fehler").innerHTML = error.message;   */
        console.log('Fehler beim Favorit ON:', error.message);
        return 'nok';
    }
}
// Funktion für favoriten OFF
async function favoritOff(jobid) {    
    try {
        if (glob_user_rolle == 0) {
            alert('Für diese Funktion musst du eingeloggt sein!');
            throw new Error("Für diese Funktion musst du eingeloggt sein!");}     

        apiUrl = glob_jobs_server +  '/favoriten/off';
        
        console.log(' Favoriten OFF - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({glob_user_id, jobid}),
        }
        const response = await fetch(apiUrl, fetchHead);
        const responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ['message']);} // wenn ein Feheler (nicht OK) zurückkommt, wird eine Fehler generiert, weiter bei catch
        
        return 'ok';
    } 
    catch (error) {
        /*document.getElementById("update_name-fehler").innerHTML = error.message;   */
        console.log('Fehler beim Favorit OFF:', error.message);
        return 'nok';
    }
}
// Funktion für favoriten GET
async function favoritenGet() {    
    try {
        glob_favoriten = [];

        if (glob_user_rolle == 0) {return;}     

        apiUrl = glob_jobs_server + '/favoriten/get';  
        console.log('Favoriten aus Datenbank lesen - Fetch-Aufruf gestartet: ', apiUrl);
        let user_id = glob_user_id

        const fetchHead = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-cache'},
            body: JSON.stringify({user_id}),
            }
        let response = await fetch(apiUrl, fetchHead);
        let responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ['message']);} // wenn ein Feheler (NOK) zurückkommt, wird eine Fehler generiert, weiter bei catch
        
        glob_favoriten = responseJ['favoriten'];
    }
    catch (error) {
        /*document.getElementById("update_name-fehler").innerHTML = error.message;   */
        console.log('Fehler beim Favoriten einlesen:', error.message);
        }
}
// Funktion für favoriten anzeigen
async function favoriten_anzeigen() {
    try {
        hamburgerClose();
        await favoritenGet();         // Favoriten auslesen
    
        let jobs = [];
        let index = 1;
        
        glob_favoriten.forEach(favorit => {    
            
            let neuerDatensatz = {
                job_bezeichnung: favorit.fav_job_bezeichnung,
                job_firma: favorit.fav_job_firma,
                job_firma_adresse: favorit.fav_job_firma_adresse,
                job_link: favorit.fav_job_link,
                quelle: favorit.fav_job_quelle,
                job_link: favorit.fav_job_link,
                job_datum: favorit.fav_job_datum,
                key_id: favorit.fav_job_id 
                }
            
            jobs[index] = neuerDatensatz;    // Jobs directory aufbauen damit die jobs(favoriten) angezeigt werden in displayJobs 
            index++;
            });

        aufbereitenJobkarten(jobs);
        displayJobKarten();
    }
    catch (error) {
        /*document.getElementById("update_name-fehler").innerHTML = error.message;   */
        console.log('Fehler beim Favoriten einlesen:', error.message);
    }
}
// Job weiterleiten
function weiterleiten(button) {

    if (glob_user_rolle == 0) {
        alert('Für diese Funktion musst du eingeloggt sein!');
        return;} 

    glob_job_id_w = button.getAttribute('data-job-id');
       
    openWindow('weiterleiten-form','weiterleiten-name');
}
// Job weiterleiten - Mail
async function weiterleitenMail() {
    try {
        document.getElementById("weiterleiten-fehler").innerHTML = "";
        email = document.getElementById('weiterleiten-email').value;
        namean = document.getElementById('weiterleiten-name').value;
        
        x = Number(glob_job_id_w)
        const datensatz = glob_jobs.find(item => item.key_id === x);

        const jobbezeichnung = datensatz.job_bezeichnung;
        const jobfirma = datensatz.job_firma;
        const joblink = datensatz.job_link;
        const namevon = document.getElementById("current-user").innerHTML; 

        apiUrl = glob_user_server + '/jobs/weiterleitenmail';
        console.log(' weiterleitenmail - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, namevon, jobbezeichnung, jobfirma, joblink},),
        }
        const response = await fetch(apiUrl, fetchHead);
        const responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ['message']);}    // wenn ein nicht OK zurückkommt, wird eine Fehler generiert, weiter bei catch
        
        document.getElementById("weiterleiten-fehler").innerHTML = "Die E-Mail wurde versendet.";
        } 
    catch (error) {
        //document.getElementById("login-fehler").innerHTML = error.message;
        console.log('Fehler beim weiterleitenMail', error.message);
    }
}
// Job weiterleiten - WhatsApp
async function weiterleitenWhatsApp() {
    try {
        document.getElementById("weiterleiten-fehler").innerHTML = "";
        telefon = document.getElementById('weiterleiten-telefon').value;
        namean = document.getElementById('weiterleiten-name').value;
        
        x = Number(glob_job_id_w)
        const datensatz = glob_jobs.find(item => item.key_id === x);

        const jobbezeichnung = datensatz.job_bezeichnung;
        const jobfirma = datensatz.job_firma;
        const joblink = datensatz.job_link;
        const namevon = document.getElementById("current-user").innerHTML; 

        apiUrl = glob_user_server + '/jobs/weiterleitenwhatsapp';
        console.log(' weiterleitenwhatsapp - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({telefon, namevon, jobbezeichnung, jobfirma, joblink},),
        }
        const response = await fetch(apiUrl, fetchHead);
        const responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ['message']);}    // wenn ein nicht OK zurückkommt, wird eine Fehler generiert, weiter bei catch
        
        document.getElementById("weiterleiten-fehler").innerHTML = "Whatsapp wurde versendet.";
        } 
    catch (error) {
        document.getElementById("weiterleiten-fehler").innerHTML = error.message;
        console.log('Fehler beim weiterleiten durch whatsapp', error.message);
    }
}
// Freunde erfassen
async function addFreund() {
    try {
        document.getElementById('freunde-fehler').innerHTML = '';
        const name = document.getElementById('freund-name').value;
        const email = document.getElementById('freund-email').value;
        const telefon = document.getElementById('freund-telefon').value;
        
        if (name && email && telefon) {
            let x=0   
        } else {
            alert("Bitte alle Felder ausfüllen!");
            throw new Error("Bitte alle Felder ausfüllen"); // wenn ein Feheler (nicht OK) zurückkommt, wird eine Fehler generiert, weiter bei catch
        }
        apiUrl = glob_user_server + '/freunde/create';
        console.log('freunde create - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-cache'},
            body: JSON.stringify({glob_user_id, name, email, telefon}),}
            
        const response = await fetch(apiUrl, fetchHead);
        const responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ['message']);} // wenn ein Feheler (nicht OK) zurückkommt, wird eine Fehler generiert, weiter bei catch

        // wenn kein Fehler zurückkommt: 
        document.getElementById('freunde-fehler').innerHTML = 'Person wurde angelegt';
        glob_kz_f=1;
        anzeigenFreunde();
        clearInputsFreunde();
    } 
    catch (error) {
        document.getElementById('freunde-fehler').innerHTML = error;
        console.log('Fehler bei der Anlage', error.message);}
}
// Freunde Liste anzeigen
async function anzeigenFreunde() {
    try {
        glob_freunde = [];

        if (glob_user_rolle == 0) {
            alert('Für diese Funktion musst du eingeloggt sein!');
            throw new Error("Für diese Funktion musst du eingeloggt sein!");}     

        apiUrl = glob_jobs_server + '/freunde/get_all';  
        console.log('Freunde aus Datenbank lesen - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({glob_user_id}),
            }
        let response = await fetch(apiUrl, fetchHead);
        let responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ[0]['message']);} // wenn ein Feheler (NOK) zurückkommt, wird eine Fehler generiert, weiter bei catch
        
        glob_freunde = responseJ['freunde'];

        anzeigenFreundeTabelle(glob_freunde)
    }
    catch (error) {
        document.getElementById("freunde-fehler").innerHTML = error.message;   
        console.log('Fehler bei Freunde anzeigen:', error.message);
        }  
}
function anzeigenFreundeTabelle(glob_freunde) {
    let employeeListDiv = ""
    if (glob_kz_f==1) {employeeListDiv = document.getElementById('freundeListe');}
    if (glob_kz_f==2) {employeeListDiv = document.getElementById('weiterleitenListe');}
    employeeListDiv.innerHTML = ''; // Liste leeren

    let employeeHTML = `
        <table class="freunde-table">
            <thead>
                <tr>
                    <th class="freunde-header">Name</th>
                    <th class="freunde-header">E-Mail</th>
                    <th class="freunde-header">Telefon</th>
                </tr>
            </thead>
            <tbody>
    `;
    glob_freunde.forEach((freund, index) => {
        employeeHTML += `
            <tr class="freunde-row" onclick="selectFreund(${index})">
                <td class="freunde-cell">${freund.f_name}</td>
                <td class="freunde-cell">${freund.f_email}</td>
                <td class="freunde-cell">${freund.f_telefon}</td>
            </tr>
        `;
    });
    employeeHTML += `</tbody></table>`;
    if (glob_kz_f==1) {document.getElementById('freundeListe').innerHTML = employeeHTML;}
    if (glob_kz_f==2) {document.getElementById('weiterleitenListe').innerHTML = employeeHTML;}
}
// Eingabefelder Freunde leeren
function clearInputsFreunde() {
    document.getElementById('freund-name').value = '';
    document.getElementById('freund-email').value = '';
    document.getElementById('freund-telefon').value = '';

    document.getElementById('weiterleiten-name').value = '';
    document.getElementById('weiterleiten-email').value = '';
    document.getElementById('weiterleiten-telefon').value = '';

    selectedFreundeIndex = null;
}
// Freund auswählen
function selectFreund(index) {
    selectedFreundeIndex = index;
    const freund = glob_freunde[index];
    if (glob_kz_f==1) {
        document.getElementById('freund-name').value = freund.f_name;
        document.getElementById('freund-email').value = freund.f_email;
        document.getElementById('freund-telefon').value = freund.f_telefon;
    }
    if (glob_kz_f==2) {
        document.getElementById('weiterleiten-name').value = freund.f_name;
        document.getElementById('weiterleiten-email').value = freund.f_email;
        document.getElementById('weiterleiten-telefon').value = freund.f_telefon;
    }
}
// Freund updaten
async function updateFreund() {
    document.getElementById("freunde-fehler").innerHTML = "";

    if (selectedFreundeIndex == null) {
        alert("Bitte eine Person auswählen, um diese zu aktualisieren!");
        return
    }

    const id = glob_freunde[selectedFreundeIndex].f_id

    try {
        name = document.getElementById('freund-name').value    /* name ist ein reserviertes Wort */
        email = document.getElementById('freund-email').value
        telefon = document.getElementById('freund-telefon').value
        anmerkung = ""

        apiUrl = glob_user_server + '/freunde/update';        
        console.log(' Update Freund - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id, name, email, telefon, anmerkung}),
        }
        const response = await fetch(apiUrl, fetchHead);
        const responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ['message']);} // wenn ein nicht OK zurückkommt, wird eine Fehler generiert, weiter bei catch
        
        document.getElementById("freunde-fehler").innerHTML = "Person wurde geändert";
        
        glob_kz_f = 1;
        anzeigenFreunde();
        clearInputsFreunde();
    } 
    catch (error) {
        document.getElementById("freunde-fehler").innerHTML = error.message;
        console.log('Fehler beim Update Freund:', error.message);
    }
}
// Freund löschen
async function deleteFreund() {
    try {
        document.getElementById('freunde-fehler').innerHTML = '';

        if (selectedFreundeIndex == null) {
            alert("Bitte eine Person auswählen, um diese zu löschen!");
            return}

        const id = glob_freunde[selectedFreundeIndex].f_id
    
        document.getElementById('freunde-fehler').innerHTML = "";

        apiUrl = glob_user_server + '/freunde/delete';
        console.log('freunde delete - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({id}),}
    
        const response = await fetch(apiUrl, fetchHead);
        const responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ['message']);} // wenn ein Feheler (nicht OK) zurückkommt, wird eine Fehler generiert, weiter bei catch

        // wenn kein Feher zurückkommt: 
        document.getElementById('freunde-fehler').innerHTML = 'Person wurde gelöscht';
        
        glob_kz_f=1;
        anzeigenFreunde();
        clearInputsFreunde();
    } 
    catch (error) {
        document.getElementById('freunde-fehler').innerHTML = error.message;
        console.log('Fehler beim Löschen eines Freundes', error.message);}
}
// Jobalarm erfassen
async function addJobalarm() {
    try {
        document.getElementById('jobalarm-fehler').innerHTML = '';
        const ort = document.getElementById('jobalarm-ort').value;
        const job = document.getElementById('jobalarm-job').value;
        const umkreis = document.getElementById('jobalarm-umkreis').value;
        const anmerkung =""
        
        if (ort && job && umkreis) {
            let x=0   
        } else {
            throw new Error("Bitte alle Felder ausfüllen"); // wenn ein Feheler (nicht OK) zurückkommt, wird eine Fehler generiert, weiter bei catch
        }
        apiUrl = glob_user_server + '/jobalarm/create';
        console.log('jobalarm create - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-cache'},
            body: JSON.stringify({glob_user_id, ort, job, umkreis, anmerkung}),}
            
        const response = await fetch(apiUrl, fetchHead);
        const responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ['message']);} // wenn ein Feheler (nicht OK) zurückkommt, wird eine Fehler generiert, weiter bei catch

        // wenn kein Fehler zurückkommt: 
        document.getElementById('freunde-fehler').innerHTML = 'Alarm wurde angelegt';
        glob_kz_f=1;
        anzeigenJobalarm();
        clearInputsJobalarm();
    } 
    catch (error) {
        document.getElementById('jobalarm-fehler').innerHTML = error;
        console.log('Fehler bei der Anlage', error.message);}
}
// Jobalarm Liste anzeigen
async function anzeigenJobalarm() {
    try {
        glob_jobalarm = [];

        if (glob_user_rolle == 0) {
            alert('Für diese Funktion musst du eingeloggt sein!');
            throw new Error("Für diese Funktion musst du eingeloggt sein!");}     

        apiUrl = glob_jobs_server + '/jobalarm/get_all';  
        console.log('Jobalarm aus Datenbank lesen - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({glob_user_id}),
            }
        let response = await fetch(apiUrl, fetchHead);
        let responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ[0]['message']);} // wenn ein Feheler (NOK) zurückkommt, wird eine Fehler generiert, weiter bei catch
        
        glob_jobalarm = responseJ['jobalarm'];

        anzeigenJobalarmTabelle(glob_jobalarm)
    }
    catch (error) {
        document.getElementById("jobalarm-fehler").innerHTML = error.message;   
        console.log('Fehler bei Jobalarm anzeigen: ', error.message);
        }  
}
function anzeigenJobalarmTabelle(glob_jobalarm) {
    let employeeListDiv = ""
    employeeListDiv = document.getElementById('jobalarmListe');
    employeeListDiv.innerHTML = ''; // Liste leeren

    let employeeHTML = `
        <table class="jobalarm-table">
            <thead>
                <tr>
                    <th class="jobalarm-header">Ort</th>
                    <th class="jobalarm-header">Job</th>
                    <th class="jobalarm-header">Umkreis</th>
                </tr>
            </thead>
            <tbody>
    `;
    glob_jobalarm.forEach((jobalarm, index) => {
        employeeHTML += `
            <tr class="jobalarm-row" onclick="selectJobalarm(${index})">
                <td class="jobalarm-cell">${jobalarm.ja_ort}</td>
                <td class="jobalarm-cell">${jobalarm.ja_job}</td>
                <td class="jobalarm-cell">${jobalarm.ja_umkreis}</td>
            </tr>
        `;
    });
    employeeHTML += `</tbody></table>`;
    document.getElementById('jobalarmListe').innerHTML = employeeHTML;
}
// Eingabefelder Jobalarm leeren
function clearInputsJobalarm() {
    document.getElementById('jobalarm-ort').value = '';
    document.getElementById('jobalarm-job').value = '';
    document.getElementById('jobalarm-umkreis').value = '0';

    selectedJobalarmIndex = null;
}
// Jobalarm auswählen
function selectJobalarm(index) {
    selectedJobalarmIndex = index;
    const jobalarm = glob_jobalarm[index];
   
    document.getElementById('jobalarm-ort').value = jobalarm.ja_ort;
    document.getElementById('jobalarm-job').value = jobalarm.ja_job;
    document.getElementById('jobalarm-umkreis').value = jobalarm.ja_umkreis;
}
// Jobalarm updaten
async function updateJobalarm() {
    document.getElementById("jobalarm-fehler").innerHTML = "";

    if (selectedJobalarmIndex == null) {
        alert("Bitte einen Alarm auswählen, um diesen zu aktualisieren!");
        return
    }

    const id = glob_jobalarm[selectedJobalarmIndex].ja_id

    try {
        ort = document.getElementById('jobalarm-ort').value
        job = document.getElementById('jobalarm-job').value
        umkreis = document.getElementById('jobalarm-umkreis').value
        anmerkung = ""

        apiUrl = glob_user_server + '/jobalarm/update';        
        console.log(' Update Jobalarm - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id, ort, job, umkreis, anmerkung}),
        }
        const response = await fetch(apiUrl, fetchHead);
        const responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ['message']);} // wenn ein nicht OK zurückkommt, wird eine Fehler generiert, weiter bei catch
        
        document.getElementById("jobalarm-fehler").innerHTML = "Alarm wurde geändert";
        
        anzeigenJobalarm();
        clearInputsJobalarm();
    } 
    catch (error) {
        document.getElementById("jobalarm-fehler").innerHTML = error.message;
        console.log('Fehler beim Update Alarm: ', error.message);
    }
}
// Jobalarm löschen
async function deleteJobalarm() {
    try {
        document.getElementById('jobalarm-fehler').innerHTML = '';

        if (selectedJobalarmIndex == null) {
            alert("Bitte einen Alarm auswählen, um diesen zu löschen!");
            return}

        const id = glob_jobalarm[selectedJobalarmIndex].ja_id
    
        document.getElementById('jobalarm-fehler').innerHTML = "";

        apiUrl = glob_user_server + '/jobalarm/delete';
        console.log('jobalarm delete - Fetch-Aufruf gestartet: ', apiUrl);
        
        const fetchHead = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({id}),}
    
        const response = await fetch(apiUrl, fetchHead);
        const responseJ = await response.json();

        if (responseJ['status'] > 200) {
            throw new Error(responseJ['message']);} // wenn ein Feheler (nicht OK) zurückkommt, wird eine Fehler generiert, weiter bei catch

        // wenn kein Feher zurückkommt: 
        document.getElementById('jobalarm-fehler').innerHTML = 'Alarm wurde gelöscht';
        
        anzeigenJobalarm();
        clearInputsJobalarm();
    } 
    catch (error) {
        document.getElementById('jobalarm-fehler').innerHTML = error.message;
        console.log('Fehler beim Löschen eines Alarmes', error.message);}
}
// Funktion um die aktuellen Geodaten auszulesen 
function geodatenAuslesen() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log(`Deine Geodaten sind (lat, lon): ${lat},${lon}`);
                }, 
                error => {console.error('Error getting location:', error.message);}
            );
    } else {
    console.log('Geolocation ist in diesem browser nicht verfügbar.');
    }
}
// Karte mit den ausgewählten Jobs ausblenden
function ausblendenKarte() {
    const m_karte = document.getElementById("karten-form");
    m_karte.classList.add("hidden");
    //map.remove()
}
// Karte/Map mit den ausgewählten Job anzeigen
function anzeigenMap() {
    document.getElementById('job-results').classList.remove('active-jobs');
    document.getElementById('map-container').classList.add('active-map');
    map.invalidateSize();
}
// Karte/Map mit den ausgewählten Job erstellen 
function füllenMap(glob_jobs) {

    // Icons mit Leaflet-Awesome-Markers  -  Farbe: blue, green, red, orange, etc.
    var greenIcon = new L.Icon({
        iconUrl: 'img/marker-icon-2x-green.png', 
        shadowUrl: 'img/marker-shadow.png',
        iconSize: [20, 35], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });

    var redIcon = new L.Icon({
        iconUrl: 'img/marker-icon-2x-red.png',
        shadowUrl: 'img/marker-shadow.png',
        iconSize: [31, 45], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });

    try {   
        // Karte entfernen, falls sie bereits initialisiert wurde
        if (mapInitialized) {
            map.remove();
            mapInitialized = false;
        }
        // Karte initialisieren
            map = L.map('map').setView([47.2657315, 11.3939171], 9); // Zentrum auf innsbruck setzen
            map.setMinZoom(8);
            map.setMaxZoom(12);
            mapInitialized = true;  
                
            // OpenStreetMap-Kachel hinzufügen
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
        // MarkerClusterGroup erstellen
        const markers_b = L.markerClusterGroup();     // Cluster blau - mit Geo-Koordinaten
        const markers_g = L.markerClusterGroup();     // Cluster gelb - ohne Geo-Koordinaten

        // Marker hinzufügen 
        glob_jobs.forEach(job => {
            const tooltipContent = `
                <b>${job.job_bezeichnung}</b><br>
                ${job.job_firma}<br>
                ${job.job_firma_ort}<br>
                <i>${job.job_datum}   </i>
                <a href="${job.job_link}" target="_blank">Link für mehr Informationen</a>
            `;

            if (job.geo_breite) {                   // Koordinaten vorhanden
                const marker_b = L.marker([job.geo_breite, job.geo_laenge],{ icon: greenIcon });     
                marker_b.bindTooltip(tooltipContent, {permanent: false, direction: "bottom", interactive: true});
                marker_b.on('click', function () {window.open(`${job.job_link}`, '_blank')});
                markers_b.addLayer(marker_b);      
                }   
            else {                                  // keine Koordinaten vorhanden
                const marker_g = L.marker([47.368629, 11.415384],{ icon: redIcon });
                marker_g.bindTooltip(tooltipContent, {permanent: false, direction: "bottom", interactive: true});
                marker_g.on('click', function () {window.open(`${job.job_link}`, '_blank')});
                markers_g.addLayer(marker_g);
                }
        });

    // MarkerCluster zur Karte hinzufügen
    map.addLayer(markers_b);
    map.addLayer(markers_g);

    // Karte einblenden
    map.invalidateSize();

    }
    catch (error) {
        //document.getElementById('freunde-fehler').innerHTML = error.message;
        console.log('Kartenaufbau: ', error.message);}
}
function toggleListMap() {
    const jobResults = document.getElementById('job-results');
    const mapContainer = document.getElementById('map-container');
    const btnInhalt = document.getElementById('id-h-btn-map');

    if (jobResults.classList.contains('active-jobs')) {
        jobResults.classList.remove('active-jobs');
        mapContainer.classList.add('active-map');
        map.invalidateSize();
        btnInhalt.innerHTML = 'Liste ';
    } else {
        jobResults.classList.add('active-jobs');
        mapContainer.classList.remove('active-map');
        btnInhalt.innerHTML = 'Karte';
    }
}       

configureMenuBasedOnRole();