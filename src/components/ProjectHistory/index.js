import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Grid, Paper, Button, IconButton } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Header from '../Header';

const projectsData = [
  {
    name: 'nearup',
    codehash: '0x7889aa',
    url: 'https://github.com/near/nearup',
    standards: 'EIP-5, EIP-101',
    advisory_report: 'advisory_report_hash',
    completed: true
  },
  {
    name: 'nearup',
    codehash: '0xab87ba',
    url: 'https://github.com/near/nearup',
    standards: 'EIP-5, EIP-101, EIP-102',
    advisory_report: undefined,
    completed: true
  },
  {
    name: 'nearup',
    codehash: '0x1236ba',
    url: 'https://github.com/near/nearup',
    advisory_report: 'advisory_report_hash',
    standards: '',
    completed: false
  },
  {
    name: 'nearup',
    codehash: '0xddfd0a',
    url: 'https://github.com/near/nearup',
    standards: 'EIP-5',
    advisory_report: 'advisory_report_hash',
    completed: true
  }
];

export default function ProjectHistory() {
  const [projects] = useState(projectsData);

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
            <div className="card-header-alt d-flex justify-content-between p-4">
              <div>
                <h6 className="font-weight-bold font-size-lg mb-1 text-black">
                  nearup
            </h6>
                <small className="d-flex pt-2 align-items-center">
                  <a href="#/" onClick={(e) => e.preventDefault()}>
                  https://github.com/near/nearup
                  </a>
                </small>
              </div>
            </div>
            <div className="px-3 pb-3">
              <div className="bg-white">
                <PerfectScrollbar>
                  <div className="p-3">
                    {projects.map((project, i) => (
                      <div>
                        <div className="d-flex justify-content-between">
                          <div>
                            <div className="font-weight-bold">
                              <a
                                href="#/"
                                onClick={(e) => e.preventDefault()}
                                className="text-black">
                                {project.name}
                              </a>
                            </div>
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
                        { (i < projects.length - 1) ?
                          <div className="divider my-3" /> : ''
                        }
                      </div>
                    ))}
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
