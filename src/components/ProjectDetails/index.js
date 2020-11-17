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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { encode, decode } from 'js-base64';
import IPFS from '../../ipfs'
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



export default function ProjectDetails(base64Url) {
  const classes = useStyles();
  const [openPopup, setOpenPopup] = useState(false);
  const [url, setUrl] = useState(decode(base64Url));
  const [title, setTitle] = useState();
  const [projects, setProjects] = useState();
  const [description, setDescription] = useState();
  const [data, setData] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('info');

  const handleClickOpen = async (title, hash) => {
    if (!hash) return;

    setTitle(title);
    setOpenPopup(true);
    let ipfsData = await IPFS.getInstance().Load(hash);
    setData(ipfsData);
  };


  const handleClose = () => {
    setOpenPopup(false);
  };

  React.useEffect(
    () => {
      if (window.walletConnection.isSignedIn()) {
        window.contract.get_projects_list()
          .then(async projectsFromContract => {
            let proccesedProjects = new Array();

            var projectsSlice = projectsFromContract;
            while (projectsSlice.length) {
              await Promise.all(projectsSlice.splice(0, 1).map(async (project) => {
                if (project.url === url) {
                  let certificatesFromContract = await window.contract.get_project_certificates({ code_hash: project.code_hash });
                  let description = await IPFS.getInstance().Load(project.metadata);
                  proccesedProjects.push({ ...project, description: description, certificates: certificatesFromContract });
                }
              }));
            }

            proccesedProjects.sort((a, b) => {
              return b.index - a.index;
            });

            setProjects(proccesedProjects);
            console.log(window.pageProjectDetails)

            if (window.pageProjectDetails) {
              setSeverity(window.pageProjectDetails?.alert?.severity);
              setMessage(window.pageProjectDetails?.alert?.msg);
              setOpen(true);
              
              window.pageProjectDetails = null;
            }

          });
      }
    },
    [url]
  )

  const Project = (project) => (
    <div className="d-flex justify-content-between">
          <div>
            <h2 className="font-weight-bold text-black">
              {project?.name}
            </h2>
            <small className="d-flex pt-2 align-items-center">
              <a href={project?.url}>
                {project?.url}
              </a>
            </small>
            <div/>
            <small className="d-flex pt-2 align-items-center">
              <a href={project.url + '/tree/' + project.code_hash}>
                <FontAwesomeIcon icon={faGithub} /> {project.code_hash}
              </a>
            </small>
            <div className="font-weight-bold"> 
              Description
            </div>
            <small className="d-flex pt-2 align-items-center">
              {project.description}
            </small>
          </div>
      <div>
        {(project?.status) ?
          <div className="badge badge-success">Completed</div> :
          <div className="badge badge-warning">Pending</div>
        }
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.margin}
          startIcon={<AddCircleRoundedIcon />}
          component={Link}
          to={'/PageSignAudit/' + project?.code_hash + '/' + encode(project?.url)}>
          Audit
      </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.margin}
          startIcon={<AddCircleRoundedIcon />}
          component={Link}
          to={'/PageReportAdvisory/' + project?.code_hash + '/' + encode(project?.url)}>
          Advisory
      </Button>
      </div>
    </div>
  );

  const ProjectAudits = (certificates) => (
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
      {certificates?.length ? certificates?.map((certificate, i) => (
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
            <IconButton aria-label="view" disabled={certificate.advisory_hash.length === 0} onClick={() => {handleClickOpen('Advisory', certificate.advisory_hash)}}>
              <MoreVertIcon />
            </IconButton>
          </td>
        </tr>
      )) :
            <tr>
              <td className="text-center">
                No audits.
        </td>
            </tr>}
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
                  {data} 
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
                  {projects?.map((project, i) => (
                    <div>
                      <div className="p-3">
                        {project ? Project(project) : ''}
                      </div>
                      <div>
                        {ProjectAudits(project.certificates)}
                      </div>
                    </div>
                  ))}
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
