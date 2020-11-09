import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import MuiTheme from './theme';

import PageRegisterProject from './pages/PageRegisterProject';
import PageRegisterAuditor from './pages/PageRegisterAuditor';
import PageReportAdvisory from './pages/PageReportAdvisory';
import PageSignAudit from './pages/PageSignAudit';
import PageProjectHistory from './pages/PageProjectHistory';
import PageProjectDetails from './pages/PageProjectDetails';
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
            '/PageReportAdvisory:codehash',
            '/PageSignAudit:codehash',
            '/PageProjectHistory',
            '/PageProjectDetails',
            '/Login'
            ]}>
            <Switch location={location} key={location.pathname}>
                <Route path="/Homepage" component={Homepage} />
                <Route path="/PageRegisterProject" component={PageRegisterProject}/>
                <Route path="/PageRegisterAuditor" component={PageRegisterAuditor}/>
                <Route path="/PageReportAdvisory:codehash" component={PageReportAdvisory}/>
                <Route path="/PageSignAudit:codehash" component={PageSignAudit}/>
                <Route path="/PageProjectHistory" component={PageProjectHistory}/>
                <Route path="/PageProjectDetails" component={PageProjectDetails}/>
                <Route path="/Login" component={LoginPage}/>
            </Switch>
          </Route>
        </Switch>
    </ThemeProvider>
  );
};

export default Routes;
