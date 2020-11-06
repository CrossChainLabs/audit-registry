import React, {useState} from 'react';

import { Grid, Button, TextField, Paper } from '@material-ui/core';

import getConfig from '../../config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function ReportAdvisory() {
  const [codeHash, set_codeHash] = useState();
  const [advisoryHash, set_advisoryHash] = useState();
  
  const onAdvisoryReport = async () => {
    if (window.walletConnection.isSignedIn()) {
      window.contract.advisory_report({ code_hash: codeHash, advisory_hash: advisoryHash })
        .then(result => {
          console.log('onAdvisoryReport: ' + result);
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
                        placeholder="account id"
                        value={codeHash}
                        onChange={(event) => set_codeHash(event.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="font-weight-bold mb-2">
                        Advisory Hash
                      </label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="metadata"
                        value={advisoryHash}
                        onChange={(event) => set_advisoryHash(event.target.value)}
                      />
                    </div>

                    <div className="text-center mb-4">
                      <Button className="btn-primary text-uppercase font-weight-bold font-size-sm my-3"
                              onClick={onAdvisoryReport}>
                        Report
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
