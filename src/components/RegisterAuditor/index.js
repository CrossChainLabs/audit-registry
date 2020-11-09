import React, {useState} from 'react';
import { Grid, Button, TextField, Paper } from '@material-ui/core';

import IPFS from '../../ipfs'
import Alert_INFO from '../Alert';

export default function RegisterAuditor() {
  const [accountId, set_accountId] = useState();
  const [metadata, set_metadata] = useState();
  const [cid, set_cid] = useState();
  
  const onRegisterAuditor = async () => {
    if (window.walletConnection.isSignedIn()) {
      let metadata_hash = await IPFS.getInstance().Save(metadata);
      if (!metadata_hash) {
        //Unable to save metadata on IPFS'
        return;
      }

      set_cid(metadata_hash);

      window.contract.register_auditor({ account_id: accountId, metadata: metadata_hash })
        .then(result => {
          console.log('onRegisterAuditor: ' + result);
        })
    }
  }

  return (
    <>
      <div className="app-wrapper bg-white min-vh-100">
        <Grid container spacing={3}>
          {cid ? Alert_INFO('info', 'Metadata saved on IPFS') :
          Alert_INFO('error', 'Unable to save metadata on IPFS')}
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
                        multiline
                        rows={10}
                        placeholder="metadata"
                        value={metadata}
                        onChange={(event) => set_metadata(event.target.value)}
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
