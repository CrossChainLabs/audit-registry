import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import MuiTheme from './theme';

import PageRegisterProject from './pages/PageRegisterProject';
import PageRegisterAuditor from './pages/PageRegisterAuditor';
import PageReportAdvisory from './pages/PageReportAdvisory';
import PageSignAudit from './pages/PageSignAudit';
import PageProjectDetails from './pages/PageProjectDetails';
import PageAuditorDetails from './pages/PageAuditorDetails';
import LoginPage from './pages/LoginPage';
import Homepage from './pages/Homepage';

const Routes = () => {
  const location = useLocation();

  if (!window.walletConnection.isSignedIn()) {
    return (
      <ThemeProvider theme={MuiTheme}>
          <Switch>
            <Redirect exact from="/" to="/Login" />
            <Route
              path={[
              '/Login'
              ]}>
              <Switch location={location} key={location.pathname}>
                  <Route path="/Login" component={LoginPage}/>
              </Switch>
            </Route>
          </Switch>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={MuiTheme}>
        <Switch>
          <Redirect exact from="/" to="/Homepage" />
          <Redirect exact from="/Login" to="/Homepage" />
          <Route
            path={['/Homepage',
            '/PageRegisterProject',
            '/PageRegisterAuditor',
            '/PageReportAdvisory/:codehash/:url',
            '/PageSignAudit/:codehash/:url',
            '/PageProjectDetails/:url',
            '/PageAuditorDetails/:auditor/:metadata',
            '/Login'
            ]}>
            <Switch location={location} key={location.pathname}>
                <Route path="/Homepage" component={Homepage} />
                <Route path="/PageRegisterProject" component={PageRegisterProject}/>
                <Route path="/PageRegisterAuditor" component={PageRegisterAuditor}/>
                <Route path="/PageReportAdvisory/:codehash/:url" component={PageReportAdvisory}/>
                <Route path="/PageSignAudit/:codehash/:url" component={PageSignAudit}/>
                <Route path="/PageProjectDetails/:url" component={PageProjectDetails}/>
                <Route path="/PageAuditorDetails/:auditor/:metadata" component={PageAuditorDetails}/>
                <Route path="/Login" component={LoginPage}/>
            </Switch>
          </Route>
        </Switch>
    </ThemeProvider>
  );
};

export default Routes;
