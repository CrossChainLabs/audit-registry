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

export default function SignAudit(codehash) {
  const classes = useStyles();
  const [codeHash, set_codeHash] = useState(codehash);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('info');
  const [cookies, setCookie] = useCookies([
    'signAudit',
    'auditData',
    'audit_hash',
    'standards',
    'signature'
  ]);

  React.useEffect(
    () => {
      if (window.walletConnection.isSignedIn() && cookies.signAudit === 'true') {
        window.contract.get_project_certificates({ code_hash: codehash })
          .then(certificatesFromContract => {
            let added = false;
            certificatesFromContract.forEach(certificateFromContract => {
              if ((certificateFromContract.code_hash === codehash) &&
                 (certificateFromContract.audit_hash === cookies.audit_hash))
              {
                added = true;
              }
            });

            if (added) {
              setSeverity('success');
              setMessage(`Audit for codehash ${codehash} successfuly added !`);

              setCookie('auditData', '', { path: '/' });
              setCookie('audit_hash', '', { path: '/' });
              setCookie('standards', '', { path: '/' });
              setCookie('signature', '', { path: '/' });
            } else {
              setSeverity('error');
              setMessage(`Unable to add audit for codehash ${codehash} !`);
            }

            setCookie('signAudit', 'false', { path: '/' });
            setOpen(true);
          })
      }
    },
    []
  )

  const onSign = async () => {
    if (window.walletConnection.isSignedIn()) {
      let audit_hash = await IPFS.getInstance().Save(cookies.auditData);

      if (!audit_hash) {
        //Unable to save metadata on IPFS'
        setSeverity('error');
        setMessage('Unable to save audit data on IPFS !');
        setOpen(true);

        return;
      }

      setCookie('signAudit', 'true', { path: '/' });
      setCookie('audit_hash', audit_hash, { path: '/' });

      window.contract.sign_audit({ 
        code_hash: codeHash, 
        audit_hash: audit_hash,
        standards: cookies.standards.split(";"),
        signature: cookies.signature
      }).then(result => {
          console.log('onSignAudit: ' + result);
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
                      Sign Audit
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
                        onChange={(event) => set_codeHash(event.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="font-weight-bold mb-2">
                        Standards
                                </label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="ex: standard1;standard2;standard3"
                        value={cookies.standards}
                        onChange={(event) => setCookie('standards', event.target.value, { path: '/' })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="font-weight-bold mb-2">
                        Signature
                     </label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="signature"
                        value={cookies.signature}
                        onChange={(event) => setCookie('signature', event.target.value, { path: '/' })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="font-weight-bold mb-2">
                        Audit
                                </label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        multiline
                        rows={10}
                        placeholder="audit findings"
                        value={cookies.auditData}
                        onChange={(event) => setCookie('auditData', event.target.value, { path: '/' })}
                      />
                    </div>
                    <div className="text-center mb-4">
                      <Button className="btn-primary text-uppercase font-weight-bold font-size-sm my-3"
                              onClick={onSign}>
                        Sign
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
