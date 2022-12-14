// Document elements
const startRsvpButton = document.getElementById('startRsvp');

const form = document.getElementById('formBuscar');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

let rsvpListener = null;
let guestbookListener = null;

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
    // Subscribe to the guestbook collection
    subscribeGuestbook();
  } 
  else {
    startRsvpButton.textContent = 'Iniciar Sesión';
    form.classList.add('d-none');
    startRsvpButton.classList.remove('d-none');
    // Unsubscribe from the guestbook collection
    unsubscribeGuestbook();
  }
});

// Listen to the form submission
form.addEventListener('submit', async (e) => {
  // Prevent the default form redirect
  e.preventDefault();
  // Write a new message to the database collection "guestbook"
  addDoc(collection(db, 'guestbook'), {
    text: input.value,
    timestamp: Date.now(),
    name: auth.currentUser.displayName,
    userId: auth.currentUser.uid,
  });
  // clear message input field
  input.value = '';
  // Return false to avoid redirect
  return false;
});

// Create query for messages
const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));
onSnapshot(q, (snaps) => {
  // Reset page
  guestbook.innerHTML = '';
  // Loop through documents in database
  snaps.forEach((doc) => {
    // Create an HTML entry for each document and add it to the chat
    const entry = document.createElement('p');
    entry.textContent = doc.data().name + ': ' + doc.data().text;
    guestbook.appendChild(entry);
  });
});

// Listen to guestbook updates
function subscribeGuestbook() {
  const q = db.query(db.collection('guestbook').orderBy('timestamp', 'desc'));
  guestbookListener = onSnapshot(q, (snaps) => {
    // Reset page
    guestbook.innerHTML = '';
    // Loop through documents in database
    snaps.forEach((doc) => {
      // Create an HTML entry for each document and add it to the chat
      const entry = document.createElement('p');
      entry.textContent = doc.data().name + ': ' + doc.data().text;
      guestbook.appendChild(entry);
    });
  });
}

// Unsubscribe from guestbook updates
function unsubscribeGuestbook() {
  if (guestbookListener != null) {
    guestbookListener();
    guestbookListener = null;
  }
}