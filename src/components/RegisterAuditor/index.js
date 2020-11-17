import React, {useState} from 'react';
import { Redirect } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { Grid, Button, TextField, Paper} from '@material-ui/core';
import IPFS from '../../ipfs'

export default function RegisterAuditor() {
  const accountId =  window.accountId;
  const [redirect, setRedirect] = React.useState(false);
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
      let metadata_hash = await IPFS.getInstance().Save(cookies.auditorMetadata);

      if (!metadata_hash) {
        alert('error', `Unable to save metadata on IPFS !`, { path: '/' });
        return;
      }

      window.contract.register_auditor({
        account_id: accountId,
        metadata: metadata_hash
      }).then(result => {
        window.contract.get_auditors_list()
          .then(auditorsFromContract => {
            let added = false;
            auditorsFromContract.map((auditor) => {
              if (auditor.account_id === accountId) {
                added = true;
              }
            });

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
                        value= {window.accountId}
                        disabled
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
