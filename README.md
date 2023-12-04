# gsped-wizard

## Descrizione progetto

Questo progetto ha l'obiettivo di creare una GUI che gestisca vari casi di spedizioni o resi

## Dipendenze richieste

- Angular CLI: 17.0.5
- Node: 18.16.1
- Package Manager: npm 9.5.1

## Installazione Dipendenze

Per ubuntu

```
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs
sudo npm install -g @angular/cli
```

Per altre distro
https://nodejs.org/en/download/package-manager/

## Installazione e avvio

Scaricare la repository e spostarsi nella cartella del progetto

```
git clone git@github.com:bluecube-it/gsped-wizard.git
cd gsped-wizard
```

Installare tutte le dipendenze del progetto

```
npm install
```

Far partire il servizio

```
ng serve
```

Puntare il browser sulla URL indicata nell'output del precedente comando - tipicamente http://localhost:4200/
e aggiungere il parametro "origin" nella query string ("moldavia" o "indiaoneway", per i test usare **testmoldavia** e **testorticolario**).
