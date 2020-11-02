import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Tabs, Tab} from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

import projectLogo from '../../assets/logo-white.svg';
import Auth from '../Auth';


const useStyles = makeStyles((theme) => ({
  logo: {
    height: '4em'
  },
  toolbarMargin: {
    ...theme.mixins.toolbar,
    marginBottom: '3em'
  },
  tabContainer: {
    marginLeft: 'auto',
  },
  tab: {
    color: 'white',
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '1rem'
  }
}));

export default function Header() {
  const classes = useStyles();

  const [value, setValue] = useState(0);
  const handleChange = (e, value) => {
    setValue(value);
  }

  useEffect(() => {
    console.log(window.location.pathname);
    if (window.location.pathname === "/audit-registry/Homepage" && value !== 0) {
      setValue(0);
    } else if (window.location.pathname === "/audit-registry/PageRegisterProject" && value !== 1) {
      setValue(1);
    } else if (window.location.pathname === "/audit-registry/PageRegisterAuditor" && value !== 2) {
      setValue(2);
    }
  }, [value]);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar disableGutters>
          <NavLink to="/Homepage" title="Audit Registry" className="app-nav-logo">
            <img
              alt="Audit Registry"
              className={classes.logo}
              src={projectLogo}
            />
          </NavLink>
          <Tabs value={value} className={classes.tabContainer} onChange={handleChange} indicatorColor="primary">
            <Tab className={classes.tab} component={Link} to='/Homepage' label='Home' />
            <Tab className={classes.tab} component={Link} to='/PageRegisterProject' label='Add Project' />
            <Tab className={classes.tab} component={Link} to='/PageRegisterAuditor' label='Become an auditor' />
          </Tabs>
          <div className="divider-v d-none d-lg-block divider-v-md" />
          <Auth />
          <div className="divider-v d-none d-lg-block divider-v-md" />
        </Toolbar>
      </AppBar>
      <div className={classes.toolbarMargin} />
    </>
  );
}
