# Backlog de Jogos

Dashboard da fila de jogos por plataforma, com tempos do HowLongToBeat, notas do Metacritic e histórico de zerados. Instalável como app (PWA) e sincronizado entre celular e computador pelo Firebase.

- Login com conta Google (Firebase Authentication).
- Jogos e capas ficam no Cloud Firestore, em `users/{uid}/games` e `users/{uid}/covers`, visíveis só para o dono (ver `firestore.rules`).
- Funciona offline: as mudanças entram numa fila local e sincronizam quando a internet volta.
- Backup: menu da conta → Exportar / Importar backup (JSON).

## Configurar o Firebase
1. Em `index.html`, troque o bloco `firebaseConfig` pelo do seu projeto (Configurações do projeto → Seus apps → Web).
2. Authentication → Método de login → ative **Google**.
3. Authentication → Configurações → Domínios autorizados → adicione `<seu-usuario>.github.io`.
4. Firestore Database → Regras → cole o conteúdo de `firestore.rules` → Publicar.

## Publicar no GitHub Pages
Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / `(root)` → Save. Em 1–2 minutos o app fica em `https://<seu-usuario>.github.io/<nome-do-repo>/`.

## Instalar no Android
Abra o link no Chrome → menu ⋮ → **Instalar app** (ou pelo menu da conta, em "Instalar app").
