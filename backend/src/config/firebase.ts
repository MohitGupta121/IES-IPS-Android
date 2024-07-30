var admin = require("firebase-admin");

var serviceAccount = require("../../cms-fcm-1b68d-firebase-adminsdk-bkzdj-baf6b6c486.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})
export  default  admin