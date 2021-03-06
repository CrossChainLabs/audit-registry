import React, {useState} from 'react';
import { Redirect } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { Grid, Button, TextField, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import IPFS from '../../ipfs'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  margin: {
    margin: theme.spacing(0),
    marginBottom: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function RegisterProject() {
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);
  const [open, setOpen] = useState(false);
  const [projectNameInput, setProjectNameInput] = useState(false);
  const [projectUrlInput, setProjectUrlInput] = useState(false);
  const [projectMetadataInput, setProjectMetadataInput] = useState(false);
  const [projectCodeHashInput, setProjectCodeHashInput] = useState(false);
  const [cookies, setCookie] = useCookies(['projectName',
    'projectUrl',
    'projectMetadata',
    'projectCodeHash']);

  const alert = (severity, msg) => {
    window.homepage = {
      alert: {
        msg: msg,
        severity: severity
      }
    }
  };

  const onSubmit = async () => {
    if (window.walletConnection.isSignedIn()) {
      setProjectNameInput(!cookies.projectName)
      setProjectUrlInput(!cookies.projectUrl);
      setProjectMetadataInput(!cookies.projectMetadata);
      setProjectCodeHashInput(!cookies.projectCodeHash);

      if ((!cookies.projectName) ||
        (!cookies.projectUrl) ||
        (!cookies.projectMetadata) ||
        (!cookies.projectCodeHash)) {
        return;
      }

      setOpen(true);
      let metadata_hash = await IPFS.getInstance().Save(cookies.projectMetadata);

      if (!metadata_hash) {
        alert('error', `Unable to save metadata on IPFS !`, { path: '/' });
        return;
      }

      window.contract.register_project({ 
        name: cookies.projectName, 
        url: cookies.projectUrl,
        metadata: metadata_hash,
        code_hash: cookies.projectCodeHash
      }).then(result => {
        window.contract.get_projects_list()
          .then(projectsFromContract => {
            let added = false;
            projectsFromContract.forEach((project) => {
              if (project.code_hash === cookies.projectCodeHash) {
                added = true;
              }
            });

            setOpen(false);

            if (added) {
              alert('success', `Project ${cookies.projectName} successfuly added !`, { path: '/' });

              setCookie('projectName', '', { path: '/' });
              setCookie('projectUrl', '', { path: '/' });
              setCookie('projectMetadata', '', { path: '/' });
              setCookie('projectCodeHash', '', { path: '/' });
            } else {
              alert('error', `Unable to add project ${cookies.projectName} !`, { path: '/' });
            }

            setRedirect(true);
          })
      })
    }
  }

  if (redirect) {
    return <Redirect to='Homepage' />
  }

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
                      Add Project
                    </h1>
                  </span>
                  <div>
                  <div className="mb-3">
                    <label className="font-weight-bold mb-2">
                      Name
                      </label>
                    <TextField
                      error={projectNameInput}
                      required
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="project name"
                      value={cookies.projectName}
                      onChange={(event) => {
                        setCookie('projectName', event.target.value, { path: '/' }); 
                        setProjectNameInput(false);
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="font-weight-bold mb-2">
                      URL
                      </label>
                    <TextField
                      error={projectUrlInput}
                      required
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="project url"
                      value={cookies.projectUrl}
                      onChange={(event) => { 
                        setCookie('projectUrl', event.target.value, { path: '/' }); 
                        setProjectUrlInput(false); 
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="font-weight-bold mb-2">
                      Code Hash
                      </label>
                    <TextField
                      error={projectCodeHashInput}
                      required
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="code hash"
                      value={cookies.projectCodeHash}
                      onChange={(event) => {
                        setCookie('projectCodeHash', event.target.value, { path: '/' });
                        setProjectCodeHashInput(false);
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="font-weight-bold mb-2">
                      Description
                      </label>
                    <TextField
                      error={projectMetadataInput}
                      required
                      variant="outlined"
                      size="small"
                      fullWidth
                      multiline
                      rows={10}
                      placeholder="project metadata"
                      value={cookies.projectMetadata}
                      onChange={(event) => {
                        setCookie('projectMetadata', event.target.value, { path: '/' });
                        setProjectMetadataInput(false);
                      }}
                    />
                  </div>
                    <div className="text-center mb-4">
                      <Button 
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.margin}
                        onClick={onSubmit}>
                        Submit
                      </Button>
                      <Backdrop className={classes.backdrop} open={open}>
                        <CircularProgress color="inherit" />
                      </Backdrop>
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
