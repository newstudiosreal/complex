# COMPLEX
Piattaforma interattiva per LIM e monitor touch. React + Vite + TypeScript + Tailwind, dati locali (IndexedDB + LocalStorage), nessun backend.

## Sviluppo
    npm install
    npm run dev
    npm run build

## Pubblicazione su GitHub Pages
1. Crea un repository e fai push del progetto sul branch `main`.
2. Settings → Pages → Source: **GitHub Actions**.
3. Ogni push su `main` esegue `.github/workflows/deploy.yml`, che compila con `VITE_BASE=/<nome-repo>/`.

Il routing usa `HashRouter`: nessun 404 al refresh. Per un dominio personalizzato imposta `VITE_BASE=/`.

## Stato
- **Fase 1 (completa)**: shell, tema, sidebar comprimibile, Home, Settings, storage.
- **Fase 2 (completa)**: Whiteboard.
- **Fase 3 (completa)**: Files e Applications.
- **Fase 4 (completa)**: Classroom, QuickPanel, notifiche, profilo, Focus Mode.
- **Fase 5 (completa)**: MultiBoard, SplitScreen, Workspace, Connect, PIN, profili con dati separati, impostazioni complete.

## Limiti noti
- Lingua: solo italiano.
- Wi-Fi e Bluetooth del QuickPanel, ricerca dispositivi e voto da dispositivi in Connect sono simulati e segnalati come tali.
- Il PIN blocca l'interfaccia ma non cifra i dati.
- Il righello della lavagna è un riferimento visivo.
