import React from 'react';

import { Grid, Button, Paper } from '@material-ui/core';

import { login } from '../../utils'

export default function Login() {
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
                      Welcome to Audit Registry
                    </h1>
                    <p>
                      To continue you need to sign in using NEAR Wallet.
                    </p>
                  </span>
                  <div>
                    <div className="mb-3">
                      <div className="text-center mb-4">
                        <Button className="btn-primary text-uppercase font-weight-bold font-size-sm my-3" onClick={login}>
                          Sign in
                      </Button>
                      </div>
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
