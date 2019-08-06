import React from "react";
import * as ReactX from "./react_extension";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { FixedSizeList } from "react-window";
import PropTypes from "prop-types";
import AutoSizer from "react-virtualized-auto-sizer";
import { CircularProgress } from "@material-ui/core";
import * as _fhir from "./fhir_request_utilities.js";

import Paper from "@material-ui/core/Paper";
import PatientDataPane from "./patient_data_pane.js";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: "20px",
    paddingLeft: "10px",
    paddingRight: "5px"
  },
  paper: {
    height: "87vh",
    padding: "5px",
    display: "flex",
    flexDirection: "column"
  },
  progressContainer: {
    marginTop: "30px"
  },

  progress: {
    display: "block",
    margin: "auto"
  },
  list: {
    overflow: "auto",
    height: "90%"
  },

  listItem: {
    width: "100%",
    marginLeft: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginRight: 0
  },

  listItemPrimary: {
    fontSize: "1.1em"
  },

  listItemSecondary: {
    fontSize: "0.8em"
  }
}));

let test_patients = [
  { name: "shay", dob: "123" },
  { name: "shay", dob: "1234" },
  { name: "shay", dob: "1235" },
  { name: "shay", dob: "1236" }
];

let progressDiv = {
  display: "flex",
  alignItems: "center"
};

function get_name(patient) {
  return patient.name[0].family + ", " + patient.name[0].given.join(" ");
}

function get_age(patient) {
  //note this function is an APPROXIMATION AND DOESNT TAKE INTO ACCOUNT THE MONTH
  return new Date().getFullYear() - new Date(patient.birthDate).getFullYear();
}

function patient_card(patient, classes) {
  let age = get_age(patient);
  var gender = patient.gender[0].toUpperCase();
  let tmp = "Age: " + age + ", Gender: " + gender;

  /* 
    This is the most important function; it coordinates all of the 
    state changes that occur when the user selects a new patient 


  */

  var handlePatientChange = async () => {
    /* 
      Asynchronously unset all stateful patient data 
    */

    window.app.selectedPatient.set(() => patient);
    window.app.patientProblems.set(() => null);
    window.app.patientMedications.set(() => null);
    window.app.patientEncounters.set(() => null);

    /* 
      Asynchronously set all new stateful patient data  
    */

    _fhir
      .get_patient_problems(patient)
      .then(x => window.app.patientProblems.set(() => x));
    _fhir
      .get_patient_medications(patient, { status: "active" })
      .then(x => window.app.patientMedications.set(() => x));
    _fhir.get_patient_encounters(patient).then(function(es) {
      es.sort(function(a, b) {
        if (a.period.start < b.period.start) {
          return -1;
        }
        if (a.period.start > b.period.start) {
          return 1;
        }
        return 0;
      });
      window.app.patientEncounters.set(() => es);
    });
  };

  return (
    <ListItem
      button
      key={patient.id}
      className={classes.ListItem}
      onClick={handlePatientChange}
    >
      <ListItemText
        classes={{
          primary: classes.listItemPrimary,
          secondary: classes.listItemSecondary
        }}
        primary={get_name(patient)}
        secondary={tmp}
      />
    </ListItem>
  );
}

function PatientSelector() {
  const classes = useStyles();
  const [patients, setPatients] = ReactX.useState([], "patients");

  var content;

  if (patients.length == 0) {
    content = (
      <div className={classes.progressContainer}>
        <CircularProgress className={classes.progress} />
      </div>
    );
  } else {
    content = (
      <List className={classes.list}>
        {patients.map(function(p) {
          return patient_card(p, classes);
        })}
      </List>
    );
  }

  return (
    <Grid container className={classes.root} spacing={1}>
      <Grid item style={{ width: "20%" }}>
        <Paper className={classes.paper} square={false}>
          <div style={{ marginBottom: "10px" }}>Patient Selector</div>
          <Divider />
          {content}
        </Paper>
      </Grid>

      <Grid item style={{ width: "80%" }}>
        <Paper className={classes.paper}>
          <div style={{ marginBottom: "10px" }}>Patient Data Pane</div>
          <Divider />

          <PatientDataPane />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default PatientSelector;
