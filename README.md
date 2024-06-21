###  Ryhm-4: Decision Maker

### Eesmärk:

Otsuste langetamine võib olla keeruline, eriti kui on vaja valida mitme olulise valiku vahel. Meie plaan on pakkuda objektiivset ja usaldusväärset abi keeruliste otsuste tegemisel, võimaldades kasutajatel valida erinevate otsustusmudelite vahel ning arvestada erinevate valikukriteeriumidega.

Lühikirjeldus:

Lõime rakenduse, mis arvutab välja parima valiku, kasutades otsustusmudeleid: Forced Choice ja Analytical Hierarchy Process. Üks mudelitest on tasuta (Forced Choice) ja teine on tasuline (Analytical Hierarchy Process). Tasulise konto ostmise korral on võimalik kasutajal luua ka grupid. Seejärel arvutab süsteem kas  kogu grupile või üksikisikule vastuse.

Rakendus on tehtud Tallinna Ülikooli DTI informaatika tudengite suvepraktika raames.



### Kasutatud Tehnoloogiad ja Tööriistad:

SvelteKit (versioon 4.2.7): Kasutatud veebipõhiste kasutajaliideste loomiseks.

GitHub (versioon 2.39.3): Kasutatud versioonikontrolliks ja koostööks.

GitHub Desktop (versioon 3.4.1): Repositoride haldamiseks ja tõmbepäringute loomiseks.

Supabase (versioon 2.43.5): Kasutajaprofiilide ja gruppide haldamiseks.

Vercel (versioon 34.2.7): Rakenduse väljalaskmiseks.

Visual Studio Code (versioon 1.82.2): Projekteerimiseks ja koodi kirjutamiseks.

Figma (versioon 116.17.11): Prototüüpide ja disaini loomiseks.

Adobe Illustrator (versioon 28.5): Rakenduse logo loomiseks.

Discord (versioon stable 302556): Meeskonnasisene suhtlus.

WordPress (versioon 6.5.4): Projekti blogi/päeviku pidamiseks.

ChatGPT (versioon 3.5): Koodi lahendamiseks ja ideede genereerimiseks.

Svelte Histoire (versioon 0.17.17): Kohandatud komponentide loomiseks.


 
 ###  Tasuta versioon:
  
  Olles peamenüü lehel, vajuta “Otsuse tegija”, et alustada oma otsuste tegemist.
  Sind juhatatakse “Otsuse tegija” esimesele lehele, kus pead andma oma otsusele nime (näiteks: Autode valimine, uue voodi ostmine jne).
  Vajuta nuppu “Jätka”.
  Sisesta objektid, mille vahel tahad valida. Tasuta versioonis saad sisestada ainult kaks valikut (näiteks autode valimisel erinevad autod, korterite ostmisel erinevad korterid jne).
  Vajuta nuppu “Jätka”.
  Seejärel kuvatakse ette antud kriteeriumid: “Mugavus”, “Värv” ja “Hind”. Nende kriteeriumide põhjal vali oma eelistatud valik.
  
 ###  Tasuline versioon:
  
  Tasulise versiooni saab pärast selle ostmist.
  Tasulises versioonis saad lisaks valida ka otsuse mudeli, lisada nii palju kriteeriume kui soovid ja piiramatu arvu valikuid.
  Alusta vastamist. Vastamise pikkus sõltub kriteeriumide ja valikute kogusest.



## Paigaldusjuhis: SvelteKit Projekt

### Eeldused

Enne projekti paigaldamist veendu, et su arvutisse on installeeritud järgmised tööriistad:

- **Node.js** (soovitatav versioon: v16 või uuem)
- **npm** või **yarn** (Node'i paketihaldur)
- **Git** (versioonihaldustööriist)

### Samm 1: Projekti kloonimine GitHubist

1. Ava terminal või käsurea tööriist.
2. Klooni GitHub'i repositoorium oma arvutisse käivitades järgmine käsk:
    
    ```bash
    git clone <https://github.com/TLU-DTI/Ryhm-4.git>
    
    ```
    
3. Liigu kloonitud repositooriumi kausta:
    
    ```bash
    cd Ryhm-4
    
    ```
    

### Samm 2: Sõltuvuste installeerimine

  Projekti sõltuvused (dependencies) on vajalikud selleks, et rakendus töötaks. Installeerimiseks käivita järgmine käsk:
  
    npm install
  
  Või, kui kasutad yarn'i, siis:
  
    yarn install
  
  ### Samm 3: Rakenduse käivitamine lokaalselt
  
  Käivita rakendus arenduskeskkonnas, et näha kuidas see töötab:
  
  
  ```bash
  npm run dev
  ```
  
  
  Või, kui kasutad yarn'i, siis:
  
  
  ```bash
  yarn dev
  ```
  
  Avades brauseris `http://localhost:3000`, peaksid nägema rakendust töös.

### Samm 4: Rakenduse paigaldamine serverisse

1. **Verceli** või muu platvormi kasutamine:
    
    Kui soovid paigaldada rakenduse serverisse (nt Vercel), järgi platvormi dokumentatsiooni. Verceli puhul võid projekti otse Verceli platvormile deploy'da, sest see on juba seadistatud (nagu mainitud). Vercel suudab automaatselt käsitleda SvelteKit rakendusi.
    
2. **Kohalik server**:
    
    Kui soovid rakenduse paigaldada oma serverisse, võid kasutada näiteks `npm run build` käsku, et rakendus ehitada. Seejärel saad kasutada Node'i serverit või mõnda muud teenust (nt Docker), et rakendus serveris käima panna.
    
  Projekti ehitamine:
  
  ```bash
  npm run build
  
  ```
  
  Või:
  
  ```bash
  yarn build
  
  ```
  
  Pärast seda saad käivitada ehitatud rakenduse:
  
  ```bash
  npm run preview
  
  ```
  
  Või:
  
  ```bash
  yarn preview
  
  ```
  
  Kui soovid rakenduse käivitada serveris taustal ja pidevalt, kaalu näiteks `pm2` või `forever` kasutamist.
  
  ### Samm 5: Oma serveri kasutamine (VPS, Shared Hosting, jne.)
  
  Kui soovid kasutada oma serverit, tuleb seadistada veebiserver ja DNS kirjed käsitsi.
  
  1. **Projekti ettevalmistamine:**
      - Esiteks, ehita oma SvelteKit rakendus:
      või
          
          ```bash
          npm run build
          
          ```
          
          ```bash
          yarn build
          
          ```
          
      - Pärast ehitamist saad kasutada ehitatud faile, mis asuvad `build` kaustas.
  2. **Veebiserveri seadistamine:**
      - **Node.js server:** Kui kasutad Node.js serverit, saad käivitada rakenduse kasutades näiteks `pm2` või `forever`, mis võimaldavad rakendust taustal käivitada.
      või
          
          ```bash
          pm2 start npm --name "sinu-rakendus" -- start
          
          ```
          
          ```bash
          npm run preview
          
          ```
          
      - **Nginx või Apache:** Kui kasutad Nginx'i või Apache't, pead seadistama nende serverite konfiguratsiooni, et suunata liiklus sinu SvelteKit rakendusele.
          - Näiteks Nginx konfiguratsiooni fail võib välja näha selline:
              
              ```
              server {
                  listen 80;
                  server_name sinu-domeen.ee www.sinu-domeen.ee;
              
                  location / {
                      proxy_pass <http://localhost:3000>;
                      proxy_http_version 1.1;
                      proxy_set_header Upgrade $http_upgrade;
                      proxy_set_header Connection 'upgrade';
                      proxy_set_header Host $host;
                      proxy_cache_bypass $http_upgrade;
                  }
              }
              
              ```
              
          - Eelnevas konfiguratsioonis eeldatakse, et SvelteKit rakendus töötab `localhost:3000` porti peal. Kohanda seda vastavalt oma seadistustele.
  3. **SSL sertifikaadi seadistamine:**
      - Soovitatav on seadistada HTTPS, kasutades näiteks **Let's Encrypt** sertifikaati. Seda saab hõlpsasti teha `certbot` tööriista abil.
          
          ```bash
          sudo certbot --nginx -d sinu-domeen.ee -d www.sinu-domeen.ee
          
          ```
          
      - Järgi certbot'i juhiseid, et lõpule viia SSL sertifikaadi installatsioon.
  4. **DNS kirjed:**
      - Mine oma domeenihaldurisse ja lisa A-kirje (A record), mis suunab sinu domeeni (nt. `sinu-domeen.ee` ja `www.sinu-domeen.ee`) serveri IP-aadressile.
  

### Lisainformatsioon

- **SvelteKit**: [SvelteKit dokumentatsioon](https://kit.svelte.dev/docs)
- **Supabase**: [Supabase dokumentatsioon](https://supabase.com/docs)


### Ekraanipildid

Ekraanipildid - https://github.com/TLU-DTI/Ryhm-4/tree/main/Ekraanipildid


Viide Litsentsile - https://github.com/TLU-DTI/Ryhm-4/blob/main/LITSENTS

## Autorid

Albert Berkman
Elika Laur
Jarl Koha
Õnnela Link
Gertrud Roos

## Link veebilehele

https://valiku-volur.vercel.app
