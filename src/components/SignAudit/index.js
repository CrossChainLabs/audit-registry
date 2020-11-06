import React from 'react';

import { Grid, Button, TextField, Paper } from '@material-ui/core';

//code_hash:, audit_hash:, standards: Vector<String>, signature:
export default function RegisterAuditor() {
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
                      />
                    </div>
                    <div className="mb-3">
                      <label className="font-weight-bold mb-2">
                        Audit Hash
                                </label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="audit hash"
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
                        placeholder="standards"
                      />
                    </div>


                    <div className="text-center mb-4">
                      <Button className="btn-primary text-uppercase font-weight-bold font-size-sm my-3">
                        Submit
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
