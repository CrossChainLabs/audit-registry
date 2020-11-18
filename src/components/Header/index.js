import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

import projectLogo from '../../assets/logo-white.svg';
import Auth from '../Auth';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    color: 'white',
    fontSize: '2rem'
  },
  flex: {
    flexGrow: 1,
  },
  logo: {
    height: '4em'
  },
  toolbarMargin: {
    ...theme.mixins.toolbar,
    marginBottom: '3em'
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <>
    <div className={classes.flex}>
      <AppBar position="fixed">
          <Toolbar disableGutters>
            <NavLink to="/Homepage" title="Audit Registry" className="app-nav-logo flex">
              <Toolbar disableGutters>
                <img
                  alt="Audit Registry"
                  className={classes.logo}
                  src={projectLogo}
                />
                <Typography className={classes.root}>
                  Audit Registry
            </Typography>
              </Toolbar>
            </NavLink>
            <div className={classes.flex} />
            <Auth />
          </Toolbar>
        </AppBar>
      <div className={classes.toolbarMargin} />
      </div>
    </>
  );
}
