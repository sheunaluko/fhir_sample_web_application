import React from "react";
import * as ReactX from "./react_extension";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import { CircularProgress } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import { Timeline, TimelineEvent , TimelineBlip } from "react-event-timeline";
import Hospital from "@material-ui/icons/LocalHospital";

const useStyles = makeStyles(theme => ({
  root: {
    padding: "4px",
    overflow: "auto"
  },
  paper: {
    width: "100%"
  },
  progressContainer: {},

  pane: {
    fontSize: "0.85em",
    marginBottom: "8px"
  },
  progress: {
    display: "block",
    margin: "auto"
  },
  chip: {
    margin: theme.spacing(0.5)
  }
}));

function get_name(patient) {
  return patient.name[0].family + ", " + patient.name[0].given.join(" ");
}

function get_age(patient) {
  //note this function is an APPROXIMATION AND DOESNT TAKE INTO ACCOUNT THE MONTH
  return new Date().getFullYear() - new Date(patient.birthDate).getFullYear();
}

function bold(text) {
  return <span style={{ fontWeight: "bold" }}>{text}</span>;
}

function DemographicsPane(patient, classes) {
  var content;
  if (patient == null) {
    content = <p> Awaiting Patient Selection </p>;
  } else {
    let age = get_age(patient);
    var gender = patient.gender[0].toUpperCase();
    content = (
      <div style={{ display: "flex" }}>
        <div style={{ width: "50%" }}>
          <p>
            {" "}
            {bold("Name: ")} {get_name(patient)}
          </p>
          <p>
            {bold("Age: ")}
            {age + ", "} {bold("Gender: ")} {gender}{" "}
          </p>
          <p>
            {bold("DOB: ")} {patient.birthDate}{" "}
          </p>
        </div>
        <div style={{ width: "50%" }}>
          <p>
            {bold("Address: ")} {patient.address[0].line}
          </p>
          <p>
            {bold("City: ")}{" "}
            {patient.address[0].city + ", " + patient.address[0].state}{" "}
          </p>
          <p>
            {bold("Contact: ")} {patient.telecom[0].value}{" "}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.pane}>
      <h3>Patient Demographics:</h3>
      {content}
    </div>
  );
}

function ProblemList(patient, classes) {
  const [patientProblems, setPatientProblems] = ReactX.useState(
    null,
    "patientProblems"
  );

  var content;

  if (!window.app.selectedPatient.value) {
    content = <p> Awaiting Patient Selection </p>;
  } else if (patientProblems === null) {
    content = <CircularProgress className={classes.progress} />;
  } else {
    content = patientProblems.map(data => {
      let date = new Date(data.onsetDateTime);

      return (
        <Chip
          key={data.id}
          label={data.code.text + ", " + date.toLocaleDateString()}
          className={classes.chip}
          color="primary"
          variant="outlined"
        />
      );
    });
  }

  return (
    <div className={classes.pane}>
      <h3>Problem List:</h3>
      {content}
    </div>
  );
}

function MedList(patient, classes) {
  const [patientMedications, setPatientMedications] = ReactX.useState(
    null,
    "patientMedications"
  );

  var content;

  if (!window.app.selectedPatient.value) {
    content = <p> Awaiting Patient Selection </p>;
  } else if (patientMedications === null) {
    content = <CircularProgress className={classes.progress} />;
  } else if (patientMedications.length == 0) {
    content = [<Chip key="none" label="None" className={classes.chip} variant="outlined" />]
  } else {
    content = patientMedications.map(data => {
      return (
        <Chip
          key={data.id}
          label={data.medicationCodeableConcept.text}
          className={classes.chip}
          variant="outlined"
        />
      );
    });
  }

  return (
    <div className={classes.pane}>
      <h3>Active Medications:</h3>
      {content}
    </div>
  );
}

function Encounters(patient, classes) {
  const [patientEncounters, setPatientEncounters] = ReactX.useState(
    null,
    "patientEncounters"
  );

  var content;

  if (!window.app.selectedPatient.value) {
    content = <p> Awaiting Patient Selection </p>;
  } else if (patientEncounters === null) {
    content = <CircularProgress className={classes.progress} />;
  } else {
    content = (
      <Timeline>
        {patientEncounters.map((data,i) => {
          return (
            <TimelineEvent
              key={i}
              title={data.type[0].text}
              createdAt={new Date(data.period.start).toLocaleDateString()}
              icon={<Hospital />}> 
              { data.reasonCode ? data.reasonCode[0].coding[0].display  : null }
              </TimelineEvent>
            
          );
        })}
      </Timeline>
    );
  }

  return (
    <div className={classes.pane}>
      <h3>Healthcare Encounters:</h3>
      {content}
    </div>
  );
}

function PatientDataPane() {
  const classes = useStyles();
  const [selectedPatient, setSelectedPatient] = ReactX.useState(
    null,
    "selectedPatient"
  );

  return (
    <Grid container className={classes.root} spacing={1}>
      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={0} square={false}>
          {DemographicsPane(selectedPatient, classes)}
        </Paper>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={0} square={false}>
          {ProblemList(selectedPatient, classes)}
        </Paper>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={0} square={false}>
          {MedList(selectedPatient, classes)}
        </Paper>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={0} square={false}>
          {Encounters(selectedPatient, classes)}
        </Paper>
        <Divider />
      </Grid>
    </Grid>
  );
}

export default PatientDataPane;
