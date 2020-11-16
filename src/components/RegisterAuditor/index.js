import React, {useState} from 'react';
import { Redirect } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { Grid, Button, TextField, Paper} from '@material-ui/core';
import IPFS from '../../ipfs'

export default function RegisterAuditor() {
  const [redirect, setRedirect] = React.useState(false);
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
              setCookie('homeAlertMessage', `Auditor ${cookies.auditorAccountId} successfuly added !`, { path: '/' });
              setCookie('homeAlertSeverity', 'success', { path: '/' });

              setCookie('auditorAccountId', '', { path: '/' });
              setCookie('auditorMetadata', '', { path: '/' });
            } else {
              setCookie('homeAlertMessage', `Unable to add auditor ${cookies.auditorAccountId} !`, { path: '/' });
              setCookie('homeAlertSeverity', 'error', { path: '/' });
            }

            setCookie('registerAuditor', 'false', { path: '/' });
            setRedirect(true);
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
        setCookie('homeAlertMessage', `Unable to save metadata on IPFS !`, { path: '/' });
        setCookie('homeAlertSeverity', 'error', { path: '/' });
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
