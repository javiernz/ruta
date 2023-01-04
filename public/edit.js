// Document elements
const fichaeditar = document.getElementById('fichaeditar');
const correctamente = document.getElementById('correctamente');

const startRsvpButton = document.getElementById('startRsvp');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

let rsvpListener = null;
let guestbookListener = null;

// Access Firebase services using shorthand notation
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


// Listen to the current Auth state
auth.onAuthStateChanged((user) => {
  if (user) {
    startRsvpButton.textContent = 'Cerrar Sesión';
    formBuscar.classList.remove('d-none');
    startRsvpButton.classList.add('d-none');
  } 
  else {
    startRsvpButton.textContent = 'Iniciar Sesión';
    formBuscar.classList.add('d-none');
    startRsvpButton.classList.remove('d-none');
  }
});


// Listen to the form submission
fichaeditar.addEventListener('submit', async (e) => {
  // Prevent the default form redirect
  e.preventDefault();

  // Set database ref from current Proveedor variable
  var docRef = db.collection('proveedores').doc(currentProveedor);

  // If document exists, return data to html table, if not, return error
  docRef.set({
      nombre: nombre.value,
      zona: zona.value,
      horario: horario.value,
      reparto: reparto.value,
      notas: notas.value
  });

  nombre.value = '';
  zona.value = '';
  horario.value = '';
  reparto.value = '';
  notas.value = '';

  fichaeditar.classList.add('d-none');
  correctamente.classList.remove('d-none');

  // Return false to avoid redirect
  return false;
});

// Import excel file
if (document.getElementById('formFile')) {
  const formFile = document.getElementById('formFile');
}

if (document.getElementById('uploadExcel')) {
  const uploadExcel = document.getElementById('uploadExcel');
}

let selectedFile;

formFile.addEventListener('change', function(event) {
  selectedFile = event.target.files[0];
});

uploadExcel.addEventListener('click', function() {
  if (selectedFile) {
    var fileReader = new FileReader();
    fileReader.onload = function(event) {
      var data = event.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach(sheet => {
        let rowObject = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheet], {raw: false}
        );
        let jsonObject = JSON.stringify(rowObject);
        //document.getElementById('jsonData').innerHTML = jsonObject;
        jsonToTable(jsonObject);

        const datos = [
          {ccip:'1009147', nombre:'4 FRIENDS 1', zona:'BAGATELA', horario: '10:00', reparto:'test4', notas:'test4'},
          {ccip:'96653', nombre:'ALIMENTACION NOELI', zona:'ALISIOS', horario: 'antes de las 13:00', reparto:'test4', notas:'test4'},
        ];

        console.log(typeof datos);
        console.log(datos);

        console.log(typeof rowObject);
        console.log(rowObject);

        for (let key in rowObject) {
          var docRef = db.collection('proveedores').doc(rowObject[key].ccip);
          docRef.set({
            nombre: rowObject[key].nombre,
            zona: notUndefined(rowObject[key].zona),
            horario: notUndefined(rowObject[key].horario),
            reparto: notUndefined(rowObject[key].reparto),
            notas: notUndefined(rowObject[key].notas)
          });
        }

        /*
        for (let key in datos) {
          var docRef = db.collection('proveedores').doc(datos[key].ccip);
          docRef.set({
            nombre: datos[key].nombre,
            zona: datos[key].zona,
            horario: datos[key].horario,
            reparto: datos[key].reparto,
            notas: datos[key].notas
  
          });
        }
        */


        /*
        for (let key in rowObject) {
          var docRef = db.collection('proveedores').doc(rowObject[key].ccip);
          docRef.set({
          nombre: notUndefined(rowObject[key].nombre),
          zona: notUndefined(rowObject[key].zona),
          horario: notUndefined(rowObject[key].horario),
          reparto: notUndefined(rowObject[key].reparto),
          notas: notUndefined(rowObject[key].notas)
          })
        }
        */
      });
    };
    fileReader.readAsBinaryString(selectedFile);
  }
});

function jsonToTable(input) {
    // (B) PARSE THE JSON STRING INTO OBJECT FIRST
    data = JSON.parse(input);
   
    // (C) GENERATE TABLE
    var table = '<div class="table-responsive"><table class="table table-striped"><tr><td>CCIP</td><td>NOMBRE</td><td>ZONA</td><td>HORARIO</td><td>REPARTO</td><td>NOTAS</td></tr>';
    for (let key in data) {
      table += `<tr>
      <td>${data[key].ccip}</td>
      <td class="text-wrap">${data[key].nombre}</td>
      <td>${notUndefined(data[key].zona)}</td>
      <td class="text-wrap">${notUndefined(data[key].horario)}</td>
      <td class="text-wrap">${notUndefined(data[key].reparto)}</td>
      <td class="text-wrap">${notUndefined(data[key].notas)}</td>
      </tr>`;
    }
    table += '</table></div>';
    document.getElementById('jsonData').innerHTML = table;
}

function notUndefined(data){
  if (!data){
    return ''
  }
  else {
    return data
  }
}