import React from "react";
//import "./App.css";
import "./newapp.css"
import Clock from "./clock.js";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import { ListItem } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Donut from "@material-ui/icons/DonutSmall";
import Snackbar from '@material-ui/core/Snackbar';
import { Toolbar } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PatientSelector from './PatientSelector.js'
import { Container } from '@material-ui/core';


const useStyles = makeStyles({
  list: {
    width: 200
  },
  fullList: {
    width: "auto"
  } , 

  title : { 
    flexGrow : 1 
  }
});

//import ReactGlobe from 'react-globe';

var divStyle = {
  padding: "20px",
  margin: "20px"
};

function App() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  window.setIt = setOpen 

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

  function toggleOpen() { 
    setOpen(!open)
  }

  return (
    <div className="App" > 
      <Drawer variant="temporary" anchor="left" open={open} onClose={handleDrawerClose}>
        <div className={classes.list}>
          <List>
            {["View", "Edit", "Analyze" ].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  <Donut />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>


      <AppBar position="static">
        <Toolbar >
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleOpen} >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            FHIR TEST APPLICATION
          </Typography>
          <Clock />
        </Toolbar>
      </AppBar>

            <div>
        <PatientSelector></PatientSelector> 
              </div>
    </div>
  );
}

export default App;
