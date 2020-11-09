import React, {useState} from 'react';

import { Grid, Button, TextField, Paper } from '@material-ui/core';

import getConfig from '../../config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function RegisterAuditor() {
  const [accountId, set_accountId] = useState();
  const [hash, set_hash] = useState();
  
  const onRegisterAuditor = async () => {
    if (window.walletConnection.isSignedIn()) {
      window.contract.register_auditor({ account_id: accountId, metadata: hash })
        .then(result => {
          console.log('onRegisterAuditor: ' + result);
        })
    }
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
                        value={accountId}
                        onChange={(event) => set_accountId(event.target.value)}
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
                        placeholder="metadata"
                        value={hash}
                        onChange={(event) => set_hash(event.target.value)}
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
