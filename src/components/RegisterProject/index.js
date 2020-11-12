import React, {useState} from 'react';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, TextField, Paper, Collapse, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';

import IPFS from '../../ipfs'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function RegisterProject() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('info');
  const [cookies, setCookie] = useCookies(['projectName',
    'projectUrl',
    'projectMetadata',
    'projectCodeHash',
    'registerProject']);

  React.useEffect(
    () => {
      if (window.walletConnection.isSignedIn() && cookies.registerProject === 'true') {
        window.contract.get_projects_list()
          .then(projectsFromContract => {
            let added = false;
            projectsFromContract.map((project) => {
              if (project.code_hash === cookies.projectCodeHash) {
                added = true;
              }
            });

            if (added) {
              setSeverity('success');
              setMessage(`Project ${cookies.projectName} successfuly added !`);

              setCookie('projectName', '', { path: '/' });
              setCookie('projectUrl', '', { path: '/' });
              setCookie('projectMetadata', '', { path: '/' });
              setCookie('projectCodeHash', '', { path: '/' });
            } else {
              setSeverity('error');
              setMessage(`Unable to add project ${cookies.projectName} !`);
            }

            setCookie('registerProject', 'false', { path: '/' });
            setOpen(true);
          })
      }
    },
    []
  )

  const onSubmit = async () => {
    if (window.walletConnection.isSignedIn()) {
      let metadata_hash = await IPFS.getInstance().Save(cookies.projectMetadata);

      if (!metadata_hash) {
        //Unable to save metadata on IPFS'
        setSeverity('error');
        setMessage('Unable to save metadata on IPFS !');
        setOpen(true);

        return;
      }

      setCookie('registerProject', 'true', { path: '/' });

      window.contract.register_project({ 
        name: cookies.projectName, 
        url: cookies.projectUrl,
        metadata: metadata_hash,
        code_hash: cookies.projectCodeHash
      }).then(result => {
          console.log('onRegisterProject: ' + result);
        })
    }
  }

  return (
    <>
      <div className="app-wrapper bg-white min-vh-100">
        <Grid container spacing={3}>
          <div className={classes.root}>
            <Collapse in={open}>
              <Alert
                severity={severity}
                action={
                  <IconButton aria-label="close" color="inherit" size="small"
                    onClick={() => { setOpen(false); }}>
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {message}
              </Alert>
            </Collapse>
          </div>
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
                        value={cookies.projectName}
                        onChange={(event) => setCookie('projectName', event.target.value, { path: '/' })}
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
                        value={cookies.projectUrl}
                        onChange={(event) => setCookie('projectUrl', event.target.value, { path: '/' })}
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
                        value={cookies.projectCodeHash}
                        onChange={(event) => setCookie('projectCodeHash', event.target.value, { path: '/' })}
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
                        value={cookies.projectMetadata}
                        onChange={(event) => setCookie('projectMetadata', event.target.value, { path: '/' })}
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
