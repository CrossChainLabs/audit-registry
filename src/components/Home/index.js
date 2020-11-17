import React from 'react';
import { Redirect } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, TextField, Paper, Collapse, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';

import Header from '../Header';
import Auditors from '../Auditors';
import Projects from '../Projects';

const useStyles = makeStyles((theme) => ({
  alert: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function Home() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('info');
  const [cookies, setCookie] = useCookies([
    'homeAlertMessage',
    'homeAlertSeverity']);

  React.useEffect(
    () => {
      if (cookies.homeAlertMessage && cookies.homeAlertSeverity) {
        setMessage(cookies.homeAlertMessage);
        setSeverity(cookies.homeAlertSeverity);
        setOpen(true);
        setCookie('homeAlertMessage', '', { path: '/' });
        setCookie('homeAlertSeverity', '', { path: '/' });
      }

      if (window.pageProjectDetails) {
        setSeverity(window.pageProjectDetails?.alert?.severity);
        setMessage(window.pageProjectDetails?.alert?.msg);
        setOpen(true);
        
        window.pageProjectDetails = null;
      }
    },
    []
  )

  return (
    <>
      <div className="app-wrapper bg-white min-vh-100">
        <Grid container spacing={6}>
        <div className={classes.alert}>
            <Collapse in={open}>
              <Alert
                severity={severity}
                action={
                  <IconButton aria-label="close" color="inherit" size="small"
                    onClick={() => { setOpen(false); }}>
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {message}
              </Alert>
            </Collapse>
          </div>
          <Grid item xs>
            <Paper/>
          </Grid>
          <Grid item xl={4}>
            <Auditors />
            <div className="divider-v d-none d-lg-block divider-v-md" />
          </Grid>
          <Grid item xl={4}>
            <div className="align-items-center">
            </div>
            <Projects />
          </Grid>
          <Grid item xs>
            <Paper />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
