// Document elements
const fichaeditar = document.getElementById('fichaeditar');
const correctamente = document.getElementById('correctamente');

const startRsvpButton = document.getElementById('startRsvp');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

let rsvpListener = null;
let guestbookListener = null;
  

// Option 2: Access Firebase services using shorthand notation
auth = firebase.auth();

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

/*
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
*/

// Listen to the form submission
fichaeditar.addEventListener('submit', async (e) => {
    // Prevent the default form redirect
    e.preventDefault();

    // Set database ref from current Proveedor variable
    var docRef = db.collection('proveedores').doc(currentProveedor);
  
    // If document exists, return data to html table, if not, return erro
    docRef.set({
        nombre: nombre.value,
        zona: zona.value,
        horario: horario.value,
        notas: notas.value
    });

    nombre.value = '';
    zona.value = '';
    horario.value = '';
    notas.value = '';

    fichaeditar.classList.add('d-none');
    correctamente.classList.remove('d-none');

    // Return false to avoid redirect
    return false;
  });
  