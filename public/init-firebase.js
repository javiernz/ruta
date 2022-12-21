// Document elements
const ficha = document.getElementById('ficha');
const ccip = document.getElementById('ccip');
const nombre = document.getElementById('nombre');
const zona = document.getElementById('zona');
const horario = document.getElementById('horario');
const notas = document.getElementById('notas');
const form = document.getElementById('formBuscar');

// Current provider
let currentProveedor = null;
  
// Inizialize firebase app
firebase.initializeApp(firebaseConfig);

// Inizialize firestore database
db = firebase.firestore();

// Listen to the form submission
form.addEventListener('submit', async (e) => {
  // Prevent the default form redirect
  e.preventDefault();

  // Set current Proveedor from input field
  currentProveedor = ccip.value;

  // Set database ref from current Proveedor variable
  var docRef = db.collection('proveedores').doc(currentProveedor);

  // If document exists, return data to html table, if not, return erro
  docRef.get().then((doc) => {
      if (doc.exists) {
        if (ficha) {
            nombre.innerHTML = '(' + currentProveedor + ') ' + doc.data().nombre;
            zona.innerHTML = doc.data().zona;
            horario.innerHTML = doc.data().horario;
            notas.innerHTML = doc.data().notas;
            ficha.classList.remove('d-none');
        }
        else if (fichaeditar) {
            nombre.value = doc.data().nombre;
            zona.value = doc.data().zona;
            horario.value = doc.data().horario;
            notas.value = doc.data().notas;
            fichaeditar.classList.remove('d-none');
        }
      }
      else {
          console.log('No such document!');
          if (ficha) {
            ficha.classList.add('d-none');
          }
          else if (fichaeditar) {
            fichaeditar.classList.add('d-none');
          }
      }
  }).catch((error) => {
      console.log('Error getting document:', error);
      ficha.classList.add('d-none');
  });

  // Empty input field
  ccip.value = '';
  if (correctamente) {
    correctamente.classList.add('d-none');
  }

  // Return false to avoid redirect
  return false;
});
