import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Paper, Button, IconButton, Table, Typography, Collapse } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import PerfectScrollbar from 'react-perfect-scrollbar';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import Header from '../Header';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));



export default function ProjectDetails(codehash) {
  const classes = useStyles();
  const [certificates, setCertificates] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState();
  const [project, setProject] = useState();
  const [ipfsHash, setIpfsHash] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('info');

  const handleClickOpen = (title, hash) => {
    setIpfsHash(hash);
    setTitle(title);
    setOpenPopup(true);
  };


  const handleClose = () => {
    setIpfsHash(null);
    setOpenPopup(false);
  };

  React.useEffect(
    () => {
      if (window.walletConnection.isSignedIn()) {
        window.contract.get_projects_list()
          .then(projectsFromContract => {
            let foundProject;
            projectsFromContract.forEach(projectFromContract => {
              if (projectFromContract.code_hash === codehash) {
                foundProject = projectFromContract;
              }
            });

            if (!foundProject) {
              setSeverity('error');
              setMessage(`Unable to find project with codehash: ${codehash} !`);
              setOpen(true);
            } else {
              setProject(foundProject);

              window.contract.get_project_certificates({code_hash: foundProject.code_hash})
              .then(certificatesFromContract => {
                setCertificates(certificatesFromContract);
              });
            }
          });
      }
    },
    []
  )

  const Project = () => (
    <div className="d-flex justify-content-between">
    <div>
      <h2 className="font-weight-bold text-black">
        {project?.name}
      </h2>
      <small className="d-flex pt-2 align-items-center">
        <a href="#/" onClick={(e) => e.preventDefault()}>
          {project?.url}
        </a>
      </small>
      <small className="d-flex pt-2 align-items-center">
        <a href="#/" onClick={(e) => e.preventDefault()}>
          codehash: {project?.code_hash}
        </a>
      </small>
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.margin}
          startIcon={<AddCircleRoundedIcon />}
          component={Link}
          to={'/PageSignAudit' + project?.code_hash}>
          Audit
      </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.margin}
          startIcon={<AddCircleRoundedIcon />}
          component={Link}
          to={'/PageReportAdvisory' + project?.code_hash}>
          Advisory
      </Button>
      </div>
    </div>
  );

  const ProjectAudits = () => (
    <div className="table-responsive-md">
    <Table className="table table-hover text-nowrap mb-0">
      <thead>
        <tr>
          <th className="bg-white text-left">Auditor</th>
          <th className="bg-white">Standards</th>
          <th className="bg-white text-left">Signature</th>
          <th className="bg-white text-center">Audit</th>
          <th className="bg-white text-center">Advisory</th>
        </tr>
      </thead>
      <tbody>
      {certificates?.map((certificate, i) => (
        <tr>
          <td className="text-center">
            <div className="d-flex align-items-center">
              <div>{certificate.auditor}</div>
            </div>
          </td>
          <td>
            <div className="d-flex align-items-center">
              <div>{certificate.standards}</div>
            </div>
          </td>
          <td className="text-center">
            <div className="d-flex align-items-center">
              <div>{certificate.signature}</div>
            </div>
          </td>
          <td className="text-center">
            <IconButton  aria-label="view" onClick={() => {handleClickOpen('Audit', certificate.audit_hash)}}>
              <MoreVertIcon />
            </IconButton>
          </td>
          <td className="text-center">
            <IconButton aria-label="view" hidden={certificate.advisory_hash} onClick={() => {handleClickOpen('Advisory', certificate.advisory_hash)}}>
              <MoreVertIcon />
            </IconButton>
          </td>
        </tr>
        ))}
      </tbody>
    </Table>
  </div>
  );

  return (
    <>
      <div className="hero-wrapper bg-composed-wrapper bg-white">
        <div className="header-top-section pb-2">
          <Header />
        </div>
      </div>
      <Grid container>
        <Grid container spacing={6}>
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
            <Dialog
              aria-labelledby="customized-dialog-title"
              open={openPopup}
            >
              <DialogTitle id="customized-dialog-title">
                {title}
              </DialogTitle>
              <DialogContent dividers>
                <Typography gutterBottom>
                  {ipfsHash} 
              </Typography>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">
                  Close
            </Button>
              </DialogActions>
            </Dialog>
          </Grid>
          <Grid item xl={6}>
            <div className="px-3 pb-3">
              <div className="bg-white">
                <PerfectScrollbar>
                  <div className="p-3">
                    {project ? <Project /> : ''}
                  </div>
                  {project ? <ProjectAudits /> : ''}
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
