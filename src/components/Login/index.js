import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Paper } from '@material-ui/core';

import { login } from '../../utils'

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(0),
    marginBottom: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function Login() {
  const classes = useStyles();
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
                      Welcome to Audit Registry
                    </h1>
                    <p>
                      To continue you need to sign in using NEAR Wallet.
                    </p>
                  </span>
                  <div>
                    <div className="mb-3">
                      <div className="text-center mb-4">
                        <Button 
                          variant="contained"
                          color="primary"
                          size="small"
                          className={classes.margin}
                          onClick={login}>
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
      </div>
    </>
  );
}
