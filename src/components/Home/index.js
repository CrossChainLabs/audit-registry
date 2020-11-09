import React from 'react';

import { Grid, Paper, CircularProgress } from '@material-ui/core';

import Header from '../Header';
import Auditors from '../Auditors';
import Projects from '../Projects';

export default function Home() {
  return (
    <>
      <div className="hero-wrapper bg-composed-wrapper bg-white">
        <div className="header-top-section pb-2">
          <Header />
        </div>
      </div>
      <Grid container>
        <Grid container spacing={6}>
          <Grid item xs>
            <Paper/>
          </Grid>
          <Grid item xl={4}>
            <Auditors />
            <div className="divider-v d-none d-lg-block divider-v-md" />
          </Grid>
          <Grid item xl={4}>
            <div className="align-items-center">
            </div>
            <Projects />
          </Grid>
          <Grid item xs>
            <Paper />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
