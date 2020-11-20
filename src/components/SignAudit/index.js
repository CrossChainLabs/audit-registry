import React, {useState} from 'react';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, TextField, Paper } from '@material-ui/core';
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

export default function SignAudit(codehash, url) {
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);
  const [open, setOpen] = useState(false);
  const [standardsInput, setStandardsInput] = useState(false);
  const [signatureInput, setSignatureInput] = useState(false);
  const [auditDataInput, setAuditDataInput] = useState(false);
  const [cookies, setCookie] = useCookies([
    'auditData',
    'standards',
    'signature'
  ]);

  const alert = (severity, msg) => {
    window.pageProjectDetails = {
      alert: {
        msg: msg,
        severity: severity
      }
    }
  };


  const onSign = async () => {
    if (window.walletConnection.isSignedIn()) {
      setAuditDataInput(!cookies.auditData);
      setStandardsInput(!cookies.standards);
      setSignatureInput(!cookies.signature);

      if ((!cookies.auditData) ||
        (!cookies.standards) ||
        (!cookies.signature)) {
        return;
      }

      setOpen(true);
      let audit_hash = await IPFS.getInstance().Save(cookies.auditData);

      if (!audit_hash) {
        alert('error', 'Unable to save audit data on IPFS !');

        return;
      }

      window.contract.sign_audit({ 
        code_hash: codehash, 
        audit_hash: audit_hash,
        standards: cookies.standards.split(";"),
        signature: cookies.signature
      }).then(result => {
        window.contract.get_project_certificates({ code_hash: codehash })
        .then(certificatesFromContract => {
          let added = false;
          certificatesFromContract.forEach(certificateFromContract => {
            if ((certificateFromContract.store.code_hash === codehash) &&
               (certificateFromContract.store.audit_hash === audit_hash))
            {
              added = true;
            }
          });

          setOpen(false);

          if (added) {
            alert('success', `Audit for codehash: ${codehash} successfuly added !`);

            setCookie('auditData', '', { path: '/' });
            setCookie('standards', '', { path: '/' });
            setCookie('signature', '', { path: '/' });
          } else {
            alert('error', `Unable to add audit for codehash ${codehash} !`);
          }

          setRedirect(true);
        })
      })
    }
  }

  if (redirect) {
    return <Redirect to={'/PageProjectDetails/' + url} />
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
                      Sign Audit
                              </h1>
                  </span>
                  <form noValidate autoComplete="off">
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
                        value={codehash}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label className="font-weight-bold mb-2">
                        Standards
                                </label>
                      <TextField
                        error={standardsInput}
                        required
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="ex: standard1;standard2;standard3"
                        value={cookies.standards}
                        onChange={(event) => {
                          setCookie('standards', event.target.value, { path: '/' }); 
                          setStandardsInput(false);
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="font-weight-bold mb-2">
                        Signature
                     </label>
                      <TextField
                        error={signatureInput}
                        required
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="signature"
                        value={cookies.signature}
                        onChange={(event) => {
                          setCookie('signature', event.target.value, { path: '/' }); 
                          setSignatureInput(false);
                        }}
                      />
                    </div>
                  <div className="mb-3">
                    <label className="font-weight-bold mb-2">
                      Audit
                      </label>
                    <TextField
                      error={auditDataInput}
                      required
                      variant="outlined"
                      size="small"
                      fullWidth
                      multiline
                      rows={10}
                      placeholder="audit findings"
                      value={cookies.auditData}
                      onChange={(event) => {
                        setCookie('auditData', event.target.value, { path: '/' }); 
                        setAuditDataInput(false);
                      }}
                    />
                  </div>
                    <div className="text-center mb-4">
                      <Button 
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.margin}
                        onClick={onSign}>
                        Sign
                      </Button>
                      <Backdrop className={classes.backdrop} open={open}>
                        <CircularProgress color="inherit" />
                      </Backdrop>
                    </div>
                  </div>
                  </form>
                </div>
              </div>
            </Grid>
            <Grid item xs>
              <Paper />
            </Grid>
          </Grid>
      </div>
    </>
  );
}
