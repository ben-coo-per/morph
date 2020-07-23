// var form = document.querySelector("#emailSubmissionForm");
// var select = document.querySelector("#emailAddress");
//
// // When the form is submitted...
// form.addEventListener("submit", function (event) {
//   event.preventDefault();
//
//   // POST the data
//   axios.post(airtable_write_endpoint, {
//     fields: {
//       email: select.options[select.selectedIndex].value,
//     },
//   });
// });
//

// var submitURL =
//   "https://api.airtable.com/v0/appM60AXuV6ZUXo1v/Table%201?api_key=keyd53hWYGLlDlwa0";
// var form = $("#emailSubmissionForm");
// form.on("submit", function (e) {
//   e.preventDefault();
//   var email = $(this).find("input[name=email]").val();
//
//   if (!email) {
//     $(this).find("input[name=email]").addClass("error");
//     return;
//   }
//   var data = {
//     fields: {
//       Email: email,
//     },
//   };
//   $.post(submitURL, data, function (data) {
//     $("#submit-message").text("Submitted!!!!");
//     console.log("success", data);
//   });
// });

var Airtable = require("airtable");
var base = new Airtable({ apiKey: "keyR8mmyA9sWs03q4" }).base(
  "app2Wae4ObOXKc9Uh"
);

base("Table 1").create(
  [
    {
      fields: { email: select.options[select.selectedIndex].value },
    },
    {
      fields: {},
    },
  ],
  function (err, records) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function (record) {
      console.log(record.getId());
    });
  }
);
