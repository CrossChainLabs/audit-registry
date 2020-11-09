import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Paper, Button, IconButton, Table } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ViewHeadline } from "@material-ui/icons";
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';

import Header from '../Header';
import Alert_INFO from '../Alert';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1), 
  },
}));
export default function ProjectDetails() {
  const classes = useStyles();

  const project =
  {
    name: 'nearup',
    codehash: '0x7889aa',
    url: 'https://github.com/near/nearup',
    completed: true
  };

  const audits = [
    {
      auditor: 'Auditor 1',
      standards: 'EIP-5, EIP-101',
      signature: 'e-signature',
      audit_hash: '889aafff',
      advisory_report: '889aafff',
    },
    {
      auditor: 'Auditor 2',
      standards: 'EIP-5, EIP-101',
      signature: 'e-signature      2',
      audit_hash: '889aafff',
      advisory_report: '889aafff',
    },
    {
      auditor: 'Auditor 3',
      standards: 'EIP-5',
      signature: 'esig',
      audit_hash: '889aafff',
      advisory_report: '889aafff',
    },
    {
      auditor: 'Auditor 4',
      standards: 'EIP-101',
      signature: 'e-signature',
      audit_hash: '889aafff',
      advisory_report: '889aafff',
    },
    {
      auditor: 'Auditor 5',
      standards: 'EIP-5, EIP-101, EIP-105, EIP-120, EIP-131',
      signature: 'e-signature 3',
      audit_hash: '889aafff',
      advisory_report: '889aafff',
    },
    {
      auditor: 'Auditor 6',
      standards: 'EIP-5, EIP-101',
      signature: 'e-signature',
      audit_hash: '889aafff',
      advisory_report: '889aafff',
    },
  ];

  return (
    <>
      <div className="hero-wrapper bg-composed-wrapper bg-white">
        <div className="header-top-section pb-2">
          <Header />
        </div>
      </div>
      <Grid container>
      {Alert_INFO('info', 'test')}
        <Grid container spacing={6}>
          <Grid item xs>
            <Paper />
          </Grid>
          <Grid item xl={6}>
            <div className="px-3 pb-3">
              <div className="bg-white">
                <PerfectScrollbar>
                  <div className="p-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h2 className="font-weight-bold text-black">
                        {project.name}
                      </h2>
                      <small className="d-flex pt-2 align-items-center">
                        <a href="#/" onClick={(e) => e.preventDefault()}>
                          {project.url}
                        </a>
                      </small>
                      <small className="d-flex pt-2 align-items-center">
                        <a href="#/" onClick={(e) => e.preventDefault()}>
                          codehash: {project.codehash}
                        </a>
                      </small>
                      </div>
                      <div>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          className={classes.margin}
                          startIcon={<AddCircleRoundedIcon />}
                          component={Link}
                          to={'/PageSignAudit' + project.codehash}>
                          Audit
                      </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          className={classes.margin}
                          startIcon={<AddCircleRoundedIcon />}
                          component={Link}
                          to={'/PageReportAdvisory' + project.codehash}>
                          Advisory
                      </Button>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive-md">
                    <Table className="table table-hover text-nowrap mb-0">
                      <thead>
                        <tr>
                          <th className="bg-white text-left">Auditor</th>
                          <th className="bg-white">Standards</th>
                          <th className="bg-white text-left">Signature</th>
                          <th className="bg-white text-center">Audit</th>
                          <th className="bg-white text-center">Advisory</th>
                        </tr>
                      </thead>
                      <tbody>
                      {audits.map((audit, i) => (
                        <tr>
                          <td className="text-center">
                            <div className="d-flex align-items-center">
                              <div>{audit.auditor}</div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>{audit.standards}</div>
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="d-flex align-items-center">
                              <div>{audit.signature}</div>
                            </div>
                          </td>
                          <td className="text-center">
                            <Button
                              size="small"
                              className="btn-link d-30 p-0 btn-icon hover-scale-sm">View
                            </Button>
                          </td>
                          <td className="text-center">
                            <Button
                              size="small"
                              className="btn-link d-30 p-0 btn-icon hover-scale-sm">View
                            </Button>
                          </td>
                        </tr>
                        ))}
                      </tbody>
                    </Table>
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
