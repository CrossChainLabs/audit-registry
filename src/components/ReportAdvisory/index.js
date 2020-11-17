import React, {useState} from 'react';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, TextField, Paper, Collapse, IconButton } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from "react-router-dom";

import IPFS from '../../ipfs'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function ReportAdvisory(codehash, url) {
  const classes = useStyles();
  const [redirect, setRedirect] = React.useState(false);
  const [codeHash, set_codeHash] = useState(codehash);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('info');
  const [cookies, setCookie] = useCookies([
    'advisoryData'
  ]);

  const alert = (severity, msg) => {
    window.pageProjectDetails = {
      alert: {
        msg: msg,
        severity: severity
      }
    }
  };
  
  const onAdvisoryReport = async () => {
    if (window.walletConnection.isSignedIn()) {
      setOpen(true);
      let advisory_hash = await IPFS.getInstance().Save(cookies.advisoryData);

      if (!advisory_hash) {
        alert('error', 'Unable to save advisory data on IPFS !');
        return;
      }

      window.contract.report_advisory({ code_hash: codehash, advisory_hash: advisory_hash })
        .then(result => {
          window.contract.get_project_certificates({ code_hash: codehash })
          .then(certificatesFromContract => {
            let added = false;
            certificatesFromContract.forEach(certificateFromContract => {
              if ((certificateFromContract.code_hash === codehash) &&
                 (certificateFromContract.advisory_hash === advisory_hash))
              {
                added = true;
              }
            });

            setOpen(false);

            if (added) {
              alert('success', `Advisory for codehash: ${codehash} successfuly added !`);

              setCookie('advisoryData', '', { path: '/' });
            } else {
              alert('error', `Unable to add advisory for codehash ${codehash} !`);
            }

            setRedirect(true);
          })
        });
    }
  }

  if (redirect) {
    return <Redirect to={'/PageProjectDetails/' + url} />
  }

  return (
    <>
      <div className="app-wrapper bg-white min-vh-100">
        <Grid container spacing={3}>
          <Grid item xs>
            <Paper />
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs>
              <Paper />
            </Grid>
            <Grid item xs>
              <div className="w-100 pr-0 pr-lg-5">
                <div className="text-black mt-3">
                  <span className="text-center">
                    <h1 className="display-4 mb-1 font-weight-bold">
                    Report Advisory
                              </h1>
                  </span>
                  <div>
                    <div className="mb-3">
                      <label className="font-weight-bold mb-2">
                        Code Hash
                      </label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="code hash"
                        value={codeHash}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label className="font-weight-bold mb-2">
                        Advisory
                      </label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        multiline
                        rows={10}
                        placeholder="advisory report"
                        value={cookies.advisoryData}
                        onChange={(event) => setCookie('advisoryData', event.target.value, { path: '/' })}
                      />
                    </div>

                    <div className="text-center mb-4">
                      <Button 
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.margin}
                        onClick={onAdvisoryReport}>
                        Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="inherit" />
              </Backdrop>
            </Grid>
            <Grid item xs>
              <Paper />
            </Grid>
          </Grid>
          <Grid item xs>
            <Paper />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
