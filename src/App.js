import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import ScrollToTop from './utils/ScrollToTop';
import './assets/base.scss';

class App extends Component {
  render() {
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
