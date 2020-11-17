import 'regenerator-runtime/runtime'
import React from 'react'
import { Redirect } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';

import { logout } from '../../utils'

const useStyles = makeStyles((theme) => ({
  root: {
    color: 'white'
  }
}));


const Auth = (props) => {
  const classes = useStyles();

  const onLogout = () => {
    logout();
    return <Redirect to="/Login" />
  }

  return (
    <>
      <Typography className={classes.root}>
        {window.accountId}
      </Typography>
      <Button
        className={classes.root}
        hidden={window.walletConnection.isSignedIn() === false}
        variant="text"
        size="small"
        onClick={() => onLogout()}
      >
        <ExitToAppOutlinedIcon />
      </Button>

    </>
  )
}

export default Auth;