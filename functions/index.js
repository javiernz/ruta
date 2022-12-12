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

  const currentCookie = 'RMrl74VcDC4zK6uLd3pgw6uC1vS0ihXrS5qCloFRLkvUEPWDFTcArauVH6R3IXv5fzujSJeFaFSAtlTYvXy0o1TURJrDt1YJcKAgKgdHxJFo6uA93sMSQJqKSb2m3NmVRI3w0nFctev6Lg6kdh18KwPea83dSuGTKMuDMyorv9FTQUVDTRqdItshsalmBsEvLrkkAADWIYGDAIDniluhupVL1gqh1Tobxvk0rk0qjXLd8RjlYgUh6usMIwA3eJix';

  const dbRef = firebase.database().ref();

  var chacho;

  dbRef.child('cookie').orderByChild('__session').equalTo(currentCookie).on('value' , function(snapshot) {
    snapshot.forEach(function(data) {
      chacho = data.key;
      console.log(chacho);
    });

    if (chacho != null) {
      res.sendFile(dir + 'index.html');
    }
    else {
      res.sendFile(dir + 'login.html');
    }  
  });

  /*

  dbRef.child('cookie').orderByValue().equalTo(currentCookie).on('value', function(snapshot) {
    snapshot.forEach(function(data) {
      chacho = data.key;
    });

    if (chacho != null) {
      res.sendFile(dir + 'index.html');
    }
    else {
      res.sendFile(dir + 'login.html');
    }  
  });



  ref.child('users').orderByChild('name').equalTo('John Doe').on("value", function(snapshot) {
      console.log(snapshot.val());
      snapshot.forEach(function(data) {
          console.log(data.key);
      });
  });
  */

  /*
  dbRef.child(`cookie/${currentCookie}`).get().then((snapshot) => {

    if (snapshot.exists()) {
      //console.log(snapshot.val());
      res.sendFile(dir + 'index.html')
    } else {
      //console.log('No data available');
      res.json('Datos no disponibles');
    }
  }).catch((error) => {
    console.error(error);
  });
  */
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

// Take the id parameter passed to this HTTP endpoint and return 
// Realtime database object under the path /proveedores/:documentId/id
exports.checkPassword = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.body.password === process.env.PASSWORD) {
      if (cookie.parse(req.headers.cookie).__session != '') {
        const stateCookie = cookie.parse(req.headers.cookie).__session
        console.log(cookie.parse(req.headers.cookie).__session);
        res.send(stateCookie);
      }
      else {

        const __session = makeCookie(256);

        const db = firebase.database().ref('cookie/' + __session);
        
        db.set({
          __session
        });

        res.json(__session);
      }
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