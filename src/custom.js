import * as fhir_util from "./fhir_request_utilities.js"

window.onload = function() {
  // FHIR stuff
  let fhir_url = "http://test.fhir.org/r4";

  // Create fhir instance
  const client = window.FHIR.client({
    serverUrl: "https://r4.smarthealthit.org"
  });

  window.client = client;
  console.log("Loaded fhir client.");

  window._fhir = fhir_util 

  console.log("Loaded FHIR Request Utilities")

  console.log("Requesting patient data from server")
  var app = window.app 

  client.request("Patient", {flat : true , pageLimit : 1 }).then(function(data) { 
      console.log("Setting app patient data...")
      data.sort(function(a, b){
        if(a.name[0].family < b.name[0].family) { return -1; }
        if(a.name[0].family > b.name[0].family) { return 1; }
        return 0;
    })
    
    app.patients.set( () => data )
    //app.selectedPatient.set( () => data[0] )

      window.p = data[0]  // for dev 
  }) 

  
};



