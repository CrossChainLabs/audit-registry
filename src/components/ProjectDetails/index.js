import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Paper, Button, IconButton } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ViewHeadline } from "@material-ui/icons";

import Header from '../Header';



export default function ProjectDetails() {
  const project =
  {
    name: 'nearup',
    codehash: '0x7889aa',
    url: 'https://github.com/near/nearup',
    standards: 'EIP-5, EIP-101',
    signature: 'e-signature',
    audit_hash: '889aafff',
    advisory_report: 'advisory_report_hash',
    completed: true
  };

  return (
    <>
      <div className="hero-wrapper bg-composed-wrapper bg-white">
        <div className="header-top-section pb-2">
          <Header />
        </div>
      </div>
      <Grid container>
        <Grid container spacing={6}>
          <Grid item xs>
            <Paper />
          </Grid>
          <Grid item xl={4}>
            <div className="px-3 pb-3">
              <div className="bg-white">
                <PerfectScrollbar>
                  <div className="p-3">
                    <div>
                      <h2 className="font-weight-bold text-black">
                        {project.name}
                      </h2>
                      <small className="d-flex pt-2 align-items-center">
                        <a href="#/" onClick={(e) => e.preventDefault()}>
                          {project.url}
                        </a>
                      </small>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between">
                        <div>
                          <small className="d-flex pt-2 align-items-center">
                            <a href="#/" onClick={(e) => e.preventDefault()}>
                              codehash: {project.codehash}
                            </a>
                          </small>
                        </div>
                        <div>
                          {(project.completed) ?
                            <div className="badge badge-success">Completed</div> :
                            <div className="badge badge-warning">Pending</div>
                          }
                        </div>
                      </div>
                      <div className="divider my-3" />
                      <h6 className="font-weight-bold text-black">
                        Audit
                      </h6>
                      <div>
                        <small className="d-flex pt-2 align-items-center">
                          <a href="#/" onClick={(e) => e.preventDefault()}>
                            standards: {project.standards}
                          </a>
                        </small>
                        <small className="d-flex pt-2 align-items-center">
                          <a href="#/" onClick={(e) => e.preventDefault()}>
                            signature: {project.signature}
                          </a>
                        </small>
                        <small className="d-flex pt-2 align-items-center">
                          <a href="#/" onClick={(e) => e.preventDefault()}>
                            audithash: {project.audit_hash}  (IPFS)
                          </a>
                        </small>
                      </div>
                      <div className="divider my-3" />
                      <h6 className="font-weight-bold text-black">
                        Advisory
                      </h6>
                    </div>
                  </div>
                </PerfectScrollbar>
              </div>
            </div>
          </Grid>
          <Grid item xs>
            <Paper />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
