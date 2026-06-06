# Reg Park Cut Coach — Production Starter

This is a cross-platform React Native / Expo TypeScript app generated from your Excel workbook data.

## What is included

- Expo + React Native + TypeScript
- Android and iOS support from one codebase
- SQLite offline-first database
- Firebase-ready cloud sync placeholders
- Workout plan screen
- Workout logging screen
- Weekly check-in screen
- Nutrition plan screen
- Dashboard with coach-style recommendations
- Workbook-derived JSON data in `src/data/workoutProgram.json`

## Recommended tools

Install:

- Node.js LTS
- Visual Studio Code
- GitHub Desktop
- Expo Go on your phone

## Run locally

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go.

## Run in VS Code

1. Extract this folder.
2. Open the folder in VS Code.
3. Open Terminal in VS Code.
4. Run:

```bash
npm install
npx expo start
```

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial Reg Park workout app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/reg-park-workout-app.git
git push -u origin main
```

## Firebase setup

When you are ready for cloud backup:

1. Create a Firebase project.
2. Enable Authentication.
3. Enable Firestore.
4. Replace placeholders in `src/config/firebase.ts`.
5. Add real login screens.
6. Call the sync functions in `src/services/syncService.ts` after login.

## App Store / Play Store builds

Use Expo Application Services:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android
eas build --platform ios
```

For iOS builds, you need an Apple Developer account.

## Next development steps

1. Add user authentication.
2. Add charts for bodyweight and estimated 1RM.
3. Add PR detection.
4. Add exercise history by lift.
5. Add automatic next-week weight recommendations.
6. Add a coach/admin dashboard if this becomes more than a personal app.
