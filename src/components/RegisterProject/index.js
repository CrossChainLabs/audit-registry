import React, {useState} from 'react';
import { Grid, Button, TextField, Paper } from '@material-ui/core';

export default function RegisterProject() {
  const [name, set_name] = useState();
  const [url, set_url] = useState();
  const [metadata, set_metadata] = useState();
  const [codeHash, set_codeHash] = useState();

  const onSubmit = async () => {
    if (window.walletConnection.isSignedIn()) {
      window.contract.register_project({ 
        name: name, 
        url: url,
        metadata: metadata,
        code_hash: codeHash
      }).then(result => {
          console.log('onSignAudit: ' + result);
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
                      Add Project
                              </h1>
                  </span>
                  <div>
                    <div className="mb-3">
                      <label className="font-weight-bold mb-2">
                        Name
                                </label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="project name"
                        value={name}
                        onChange={(event) => set_name(event.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="font-weight-bold mb-2">
                        URL
                                </label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="project url"
                        value={url}
                        onChange={(event) => set_url(event.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="font-weight-bold mb-2">
                        Code Hash
                                </label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="code hash"
                        value={codeHash}
                        onChange={(event) => set_codeHash(event.target.value)}
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
                        placeholder="project metadata"
                        value={metadata}
                        onChange={(event) => set_metadata(event.target.value)}
                      />
                    </div>
                    <div className="text-center mb-4">
                      <Button className="btn-primary text-uppercase font-weight-bold font-size-sm my-3"
                              onClick={onSubmit}>
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
