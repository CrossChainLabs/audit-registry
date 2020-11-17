import 'regenerator-runtime/runtime'
import React from 'react'
import { Redirect } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
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