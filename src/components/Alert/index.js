import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

/*export default function SimpleAlerts() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert severity="error" onClose={() => {}}>This is an error alert — check it out!</Alert>
      <Alert severity="warning" onClose={() => {}}>This is a warning alert — check it out!</Alert>
      <Alert severity="info" onClose={() => {}}>This is an info alert — check it out!</Alert>
      <Alert severity="success" onClose={() => {}}>This is a success alert — check it out!</Alert>
    </div>
  );
}*/

export default function Alert_INFO(severity, msg) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
  
    return (
        <>
        <div className={classes.root}>
        <Collapse in={open}>
          <Alert
            severity={severity}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {msg}
          </Alert>
        </Collapse>
      </div>
      </>
    );
  }
