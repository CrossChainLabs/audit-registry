import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import ScrollToTop from './utils/ScrollToTop';
import './assets/base.scss';
import { useCookies } from 'react-cookie';

class App extends Component {
  render() {
    const [cookies, setCookie] = useCookies([
      'homeAlertMessage',
      'homeAlertSeverity']);
  
    setCookie('homeAlertMessage', '', { path: '/' });
    setCookie('homeAlertSeverity', '', { path: '/' });

    return (
        <BrowserRouter basename="/audit-registry/">
          <ScrollToTop>
            <Routes />
          </ScrollToTop>
        </BrowserRouter>
    );
  }
}

export default App;
