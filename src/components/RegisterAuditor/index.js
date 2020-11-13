import React, {useState} from 'react';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, TextField, Paper, Collapse, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';

import IPFS from '../../ipfs'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function RegisterAuditor() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('info');
  const [cookies, setCookie] = useCookies([
    'auditorAccountId',
    'auditorMetadata',
    'registerAuditor'
  ]);

  React.useEffect(
    () => {
      if (window.walletConnection.isSignedIn() && cookies.registerAuditor === 'true') {
        window.contract.get_auditors_list()
          .then(auditorsFromContract => {
            let added = false;
            auditorsFromContract.map((auditor) => {
              if (auditor.account_id === cookies.auditorAccountId) {
                added = true;
              }
            });

            if (added) {
              setSeverity('success');
              setMessage(`Auditor ${cookies.auditorAccountId} successfuly added !`);

              setCookie('auditorAccountId', '', { path: '/' });
              setCookie('auditorMetadata', '', { path: '/' });
            } else {
              setSeverity('error');
              setMessage(`Unable to add auditor ${cookies.auditorAccountId} !`);
            }

            setCookie('registerAuditor', 'false', { path: '/' });
            setOpen(true);
          })
      }
    },
    []
  )
  
  const onRegisterAuditor = async () => {
    if (window.walletConnection.isSignedIn()) {
      let metadata_hash = await IPFS.getInstance().Save(cookies.auditorMetadata);

      if (!metadata_hash) {
        //Unable to save metadata on IPFS'
        setSeverity('error');
        setMessage('Unable to save metadata on IPFS !');
        setOpen(true);

        return;
      }

      setCookie('registerAuditor', 'true', { path: '/' });

      window.contract.register_auditor({
        account_id: cookies.auditorAccountId,
        metadata: metadata_hash
      }).then(result => {
          console.log('onRegisterAuditor: ' + result);
        })
    }
  }

  return (
    <>
      <div className="app-wrapper bg-white min-vh-100">
        <Grid container spacing={3}>
          <div className={classes.root}>
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
                        value={cookies.auditorAccountId}
                        onChange={(event) => setCookie('auditorAccountId', event.target.value, { path: '/' })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="font-weight-bold mb-2">
                        Metadata
                                </label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        multiline
                        rows={10}
                        placeholder="metadata"
                        value={cookies.auditorMetadata}
                        onChange={(event) => setCookie('auditorMetadata', event.target.value, { path: '/' })}
                      />
                    </div>

                    <div className="text-center mb-4">
                      <Button className="btn-primary text-uppercase font-weight-bold font-size-sm my-3"
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
          <Grid item xs>
            <Paper />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
