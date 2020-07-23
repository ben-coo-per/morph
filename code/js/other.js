// function setup(){
//   // Your web app's Firebase configuration
//   var firebaseConfig = {
//     apiKey: "AIzaSyAVKIyQWKLPV-h0Gcu7msPXmEycCxknZmQ",
//     authDomain: "morph-3d0c3.firebaseapp.com",
//     databaseURL: "https://morph-3d0c3.firebaseio.com",
//     projectId: "morph-3d0c3",
//     storageBucket: "morph-3d0c3.appspot.com",
//     messagingSenderId: "418183224844",
//     appId: "1:418183224844:web:05e03b5b19b58b5170d829",
//     measurementId: "G-PM9E45G8CN"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   firebase.analytics();
//
//   console.log(firebase);
//   var database = firebase.database();
// }


// var Airtable = require("airtable");
// var base = new Airtable({ apiKey: "keyR8mmyA9sWs03q4" }).base(
//   "app2Wae4ObOXKc9Uh"
// );
//
// base("Table 1").create(
//   [
//     {
//       fields: { email: select.options[select.selectedIndex].value },
//     },
//     {
//       fields: {},
//     },
//   ],
//   function (err, records) {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     records.forEach(function (record) {
//       console.log(record.getId());
//     });
//   }
// );
