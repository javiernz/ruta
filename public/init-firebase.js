// Document elements
const ficha = document.getElementById('ficha');
const ccip = document.getElementById('ccip');
const nombre = document.getElementById('nombre');
const zona = document.getElementById('zona');
const horario = document.getElementById('horario');
const notas = document.getElementById('notas');

const startRsvpButton = document.getElementById('startRsvp');

const form = document.getElementById('formBuscar');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

let rsvpListener = null;
let guestbookListener = null;
let currentProveedor = null;

const firebaseConfig = {
  apiKey: "AIzaSyAzkMbo9CgQb-8PFm6ZZGIAQMD2Rr617Dw",
  authDomain: "ruta-22662.firebaseapp.com",
  databaseURL: "https://ruta-22662-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ruta-22662",
  storageBucket: "ruta-22662.appspot.com",
  messagingSenderId: "601490990574",
  appId: "1:601490990574:web:3c57866fe6b51192259aff",
  measurementId: "G-WFW0EKRE2E"
};
  
firebase.initializeApp(firebaseConfig);

// Option 2: Access Firebase services using shorthand notation
auth = firebase.auth();
db = firebase.firestore();

// FirebaseUI config
const uiConfig = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [{
    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    requireDisplayName: false,
    disableSignUp: {
      status: true,
      adminEmail: '',
      helpLink: 'https://www.example.com/trouble_signing_in',
    },
  }],
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
    // Handle sign-in.
    // Return false to avoid redirect.
    return false;
    },
  },
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(auth);

// Listen to login button clicks
// Called when the user clicks the RSVP button
startRsvpButton.addEventListener('click', () => {
  if (auth.currentUser) {
    // User is signed in; allows user to sign out
    auth.signOut();
  }
  else {
    // No user is signed in; allows user to sign in
    ui.start('#firebaseui-auth-container', uiConfig);
  }
});

// Listen to the current Auth state
auth.onAuthStateChanged((user) => {
  if (user) {
    startRsvpButton.textContent = 'Cerrar Sesión';
    form.classList.remove('d-none');
    startRsvpButton.classList.add('d-none');
  } 
  else {
    startRsvpButton.textContent = 'Iniciar Sesión';
    form.classList.add('d-none');
    startRsvpButton.classList.remove('d-none');
    ficha.classList.add('d-none');
  }
});

// Listen to the form submission
form.addEventListener('submit', async (e) => {
  // Prevent the default form redirect
  e.preventDefault();

  currentProveedor = ccip.value;

  var docRef = db.collection('proveedores').doc(currentProveedor);

  docRef.get().then((doc) => {
      if (doc.exists) {
          nombre.innerHTML = '(' + currentProveedor + ') ' + doc.data().nombre;
          zona.innerHTML = doc.data().zona;
          horario.innerHTML = doc.data().horario;
          notas.innerHTML = doc.data().notas;
          ficha.classList.remove('d-none');
      } else {
          console.log('No such document!');
          ficha.classList.add('d-none');
      }
  }).catch((error) => {
      console.log('Error getting document:', error);
      ficha.classList.add('d-none');
  });

  // Empty input
  ccip.value = '';

  // Return false to avoid redirect
  return false;
});