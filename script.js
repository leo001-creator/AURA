rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Vartotojų profiliai
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Pokalbiai ir privačios žinutės (matomi tik dalyviams)
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        (resource == null || request.auth.uid in resource.data.participants);
        
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }

    // Pranešimai apie pažeidimus (Report)
    match /reports/{reportId} {
      allow create: if request.auth != null;
      allow read, update, delete: if false; // Tik sistemai/administratoriams
    }
  }
}
