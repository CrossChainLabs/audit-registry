import React, {useState} from 'react';
import { Redirect } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { Grid, Button, TextField, Paper} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import IPFS from '../../ipfs'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function RegisterAuditor() {
  const accountId =  window.accountId;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [auditorMetadataInput, setAuditorMetadataInput] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [cookies, setCookie] = useCookies([
    'auditorMetadata'
  ]);

  const alert = (severity, msg) => {
    window.homepage = {
      alert: {
        msg: msg,
        severity: severity
      }
    }
  };
  
  const onRegisterAuditor = async () => {
    if (window.walletConnection.isSignedIn()) {
      if (!cookies.auditorMetadata) {
        setAuditorMetadataInput(true);
        return;
      }

      setOpen(true);
      let metadata_hash = await IPFS.getInstance().Save(cookies.auditorMetadata);

      if (!metadata_hash) {
        alert('error', `Unable to save metadata on IPFS !`, { path: '/' });
        return;
      }

      window.contract.register_auditor({
        metadata: metadata_hash
      }).then(result => {
        window.contract.get_auditors_list()
          .then(auditorsFromContract => {
            let added = false;
            auditorsFromContract.forEach((auditor) => {
              if (auditor.account_id === accountId) {
                added = true;
              }
            });

            setOpen(false);

            if (added) {
              alert('success', `Auditor ${accountId} successfuly added !`, { path: '/' });
              setCookie('auditorMetadata', '', { path: '/' });
            } else {
              alert('error', `Unable to add auditor ${accountId} !`, { path: '/' });
            }

            setRedirect(true);
          })
      })
    }
  }

  if (redirect) {
    return <Redirect to='Homepage' />
  }

  return (
    <>
      <div className="d-flex">
          <Grid container spacing={3}>
            <Grid item xs>
              <Paper />
            </Grid>
            <Grid item xs>
              <div>
                <div className="text-black mt-3">
                  <span className="text-center">
                    <h1 className="display-4 mb-1 font-weight-bold">
                      Register Auditor
                    </h1>
                  </span>
                  <div>
                    <div className="mb-3">
                      <label className="font-weight-bold mb-2">
                        Account ID
                      </label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="account id"
                        value={window.accountId}
                        disabled
                      />
                    </div>
                  <div className="mb-3">
                    <label className="font-weight-bold mb-2">
                      Description
                      </label>
                    <TextField
                      error={auditorMetadataInput}
                      required
                      variant="outlined"
                      size="small"
                      fullWidth
                      multiline
                      rows={10}
                      placeholder="metadata"
                      value={cookies.auditorMetadata}
                      onChange={(event) => {
                        setCookie('auditorMetadata', event.target.value, { path: '/' });
                        setAuditorMetadataInput(false);
                      }}
                    />
                  </div>

                    <div className="text-center mb-4">
                      <Button 
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.margin}
                        onClick={onRegisterAuditor}>
                        Register
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs>
              <Paper />
            </Grid>
          </Grid>
        <Backdrop className={classes.backdrop} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </>
  );
}
