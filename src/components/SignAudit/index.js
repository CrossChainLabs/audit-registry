import React, {useState} from 'react';
import { Grid, Button, TextField, Paper } from '@material-ui/core';

import IPFS from '../../ipfs'

export default function SignAudit(codehash) {
  const [codeHash, set_codeHash] = useState(codehash);
  const [auditData, set_auditData] = useState();
  const [standards, set_standards] = useState();
  const [signature, set_signature] = useState();

  const onSign = async () => {
    if (window.walletConnection.isSignedIn()) {
      window.contract.sign_audit({ 
        code_hash: codeHash, 
        audit_hash: auditData,
        standards: standards.split(";"),
        signature: signature
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
                        value={codeHash}
                        onChange={(event) => set_codeHash(event.target.value)}
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
                        placeholder="ex: standard1;standard2;standard3"
                        value={standards}
                        onChange={(event) => set_standards(event.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="font-weight-bold mb-2">
                        Signature
                     </label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="signature"
                        value={signature}
                        onChange={(event) => set_signature(event.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="font-weight-bold mb-2">
                        Audit
                                </label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        multiline
                        rows={10}
                        placeholder="audit findings"
                        value={auditData}
                        onChange={(event) => set_auditData(event.target.value)}
                      />
                    </div>
                    <div className="text-center mb-4">
                      <Button className="btn-primary text-uppercase font-weight-bold font-size-sm my-3"
                              onClick={onSign}>
                        Sign
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
