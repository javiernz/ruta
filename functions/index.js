// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK.
const firebase = require('firebase-admin');

// App's Firebase project database configuration
const firebaseConfig = {
  databaseURL: 'https://ruta-22662-default-rtdb.europe-west1.firebasedatabase.app',
};

const cors = require('cors')({
  origin: true,
});

const cookie = require('cookie');

const dir = __dirname + '/views/'

// Initialize app.
firebase.initializeApp();

exports.index = functions.https.onRequest(async(req, res) => {

  var currentCookie;

  if (req.headers.cookie) {
    currentCookie = cookie.parse(req.headers.cookie).__session;
  }
  else {
    currentCookie = '29YkLYH0Hp9Hw8x1LQb5pk1zBAL2WNPnbOo7Nmi3p7iMxVxpnds6X51Tu5wYlxjcRRPS5iQSHXpczqOiECkt6C3J6fCN6rLzxBsBpveBqTTJtmIznQRKwYWH5PrniiWknjZ7EzoYDHunR5m1u6NV3D6CvsWKhECf3noU2V7qZanvCn0vkKSYMsvUi0V9Ho1VGdaiK774qNRxngUPDsw2lgS3JgeJfbB7ditJ65zkjFSPz6L9sNtM69DuQ9qCVMUz';
    // currentCookie = 'temp';
  }

  const dbRef = firebase.database().ref();

  var mustLogin;

  dbRef.child('cookie').orderByChild('__session').equalTo(currentCookie).on('value' , function(snapshot) {
    snapshot.forEach(function(data) {
      mustLogin = data.key;
    });

    if (mustLogin != null) {
      res.sendFile(dir + 'index.html');
    }
    else {
      res.sendFile(dir + 'login.html');
    }  
  });
});

// Take the id parameter passed to this HTTP endpoint and return 
// Realtime database object under the path /proveedores/:documentId/id
exports.datosProveedor = functions.https.onRequest(async(req, res) => {
    cors(req, res, () => {});

    const dbRef = firebase.database().ref();

    dbRef.child('proveedores/').get().then((snapshot) => {
      if (snapshot.exists()) {
        res.json(snapshot.val());
      } else {
        res.json('Datos no disponibles');
      }
    }).catch((error) => {
      console.error(error);
    });
});

// Check for valid password
exports.checkPassword = functions.https.onRequest((req, res) => {
  cors(req, res, () => {

    var currentCookie;
  
    if (req.headers.cookie) {
      currentCookie = cookie.parse(req.headers.cookie).__session;
    }
    else {
      currentCookie = 'temp';
    }

    if (req.body.password === process.env.PASSWORD) {
      
      const __session = makeCookie(256);

      const db = firebase.database().ref('cookie/' + __session);
        
      db.set({
        __session
      });
        
      //res.json(__session);
      res.cookie('__session', __session)
      res.writeHead(200, { 'Content-Type':'text/html'});
      res.end(`"<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url='https://us-central1-ruta-22662.cloudfunctions.net/index'" /></head></body></html>"`);
    }
    else {
      res.redirect('index?p=no')
    }
  });
})

function makeCookie(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}