import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

import projectLogo from '../../assets/logo-white.svg';
import Auth from '../Auth';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar disableGutters>
          <NavLink to="/Homepage" title="Audit Registry" className="app-nav-logo">
              <img
                alt="Audit Registry"
                className={classes.logo}
                src={projectLogo}
              />
          </NavLink>
          <Typography variant="title" color="inherit" className={classes.flex}>
          <h2 className="mb-1 text-white">
                Audit Registry
          </h2>
          </Typography>
          <Auth />
        </Toolbar>
      </AppBar>
      <div className={classes.toolbarMargin} />
      </div>
    </>
  );
}
