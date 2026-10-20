rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Vartotojų profiliai: kiekvienas prisijungęs gali matyti vardus, bet keisti tik savo
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // POKALBIAI: tik pokalbio dalyviai (participants) gali matyti ir keisti pokalbį
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid in resource.data.participants || 
         request.auth.uid in request.resource.data.participants);

      // ŽINUTĖS: skaityti ir rašyti gali tik to paties pokalbio dalyviai
      match /messages/{messageId} {
        allow read, write: if request.auth != null && 
          request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
      }
    }

    // SKUNDAI / PRANEŠIMAI: bet kuris vartotojas gali pateikti skundą
    match /reports/{reportId} {
      allow create: if request.auth != null;
      allow read: if false; // Prieinama tik administratoriui
    }
  }
}
