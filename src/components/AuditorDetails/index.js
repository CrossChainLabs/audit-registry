import React from 'react';
import { Grid, Paper } from '@material-ui/core';

import PerfectScrollbar from 'react-perfect-scrollbar';

import Header from '../Header';
import IPFS from '../../ipfs'


export default function AuditorDetails(auditor, metadata) {
  const [data, setData] = React.useState();

  React.useEffect(() => {
    async function fetchData() {
      let ipfsData = await IPFS.getInstance().Load(metadata);
      setData(ipfsData);
    }
    fetchData();
  }, [metadata]); // Or [] if effect doesn't need props or state

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
            <Paper />
          </Grid>
          <Grid item xl={6}>
            <div className="px-3 pb-3">
              <div className="bg-white">
                <PerfectScrollbar>
                  <div className="p-3">
                    <div>
                      <h2 className="font-weight-bold text-black">
                        {auditor}
                        {}
                      </h2>
                    </div>
                    <div className="divider my-3" />
                    <Paper elevation={0}>
                      {data}
                    </Paper>
                  </div>
                </PerfectScrollbar>
              </div>
            </div>
          </Grid>
          <Grid item xs>
            <Paper />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
