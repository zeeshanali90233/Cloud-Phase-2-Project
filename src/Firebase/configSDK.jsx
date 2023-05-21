const admin = require('firebase-admin');
// require('dotenv').config();

const serviceAccount={
  
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key:process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id:process.env.CLIENT_ID,
    auth_uri:"https://accounts.google.com/o/oauth2/auth",
    token_uri:  "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-1j62b%40tepslms.iam.gserviceaccount.com"
  
}

// Check if the Firebase app is already initialized
if (!admin.apps.length) {
    // Initialize the Firebase app
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://tepslms-default-rtdb.firebaseio.com/',
      name: 'adminSDK'
    });
  }

module.exports = admin;
