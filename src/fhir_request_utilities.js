/* custom library for making fhir requests 
   will assume global SMART client object in namespace   
   Aug 5, 2019 @Copyright Sheun Aluko  */

import QUERY from "url-query-builder";

let smart = function() {
  return window.client;
};

/* 
  Utility function for defining / extending / composing queries 
  */

export async function base_query(endpoint, opts) {
  let url = new QUERY(endpoint, opts).get();
  console.log("[fhir_query]:: " + url);
  return await smart().request(url);
}

function extend_query_fn(fn, extender) {
  async function new_fn(patient, opts) {
    let result = await fn(patient, opts);
    if (typeof result == "object" && result.length) {
      //an array
      return result.map(extender);
    } else {
      //not an array
      return extender(result);
    }
  }
  return new_fn;
}

export async function patient_query(patient, endpoint, opts = {}) {

  
  if (endpoint == "Encounter") { 
    opts.subject = "Patient/" + patient.id 
  }  else { 
    opts.patient = patient.id;
  }
  let result = await base_query(endpoint, opts);
  if (result.entry ) { 
    return result.entry.map(e => e.resource);
  } else { 
    return [] 
  }
}

export function make_patient_query(endpoint) {
  async function fn(patient, opts) {
    return await patient_query(patient, endpoint, opts);
  }
  return fn;
}

/* 
  Begin specific query function definitions 
*/

export var get_patient_medications = make_patient_query("MedicationRequest");

export var get_patient_medications_text = extend_query_fn(
  get_patient_medications,
  med => med.medicationCodeableConcept.text
);

export var get_patient_problems = make_patient_query("Condition");
export var get_patient_encounters = make_patient_query("Encounter");

//1278
