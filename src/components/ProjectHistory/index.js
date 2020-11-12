import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Grid, Paper } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Header from '../Header';


export default function ProjectHistory(url) {
  const [projects, set_projects] = useState();
  const [name, set_name] = useState();

  React.useEffect(
    () => {
      if (window.walletConnection.isSignedIn()) {
        window.contract.get_projects_list()
          .then(projectsFromContract => {
            if (projectsFromContract.length < 1)
              return;
            //sort
            projectsFromContract.sort((a,b) => {
              return b.index - a.index;
            });

            set_name(projectsFromContract[0].name);
            //extract old versions
            let proccesedProjects = new Array();
            projectsFromContract.forEach(project => {
              if (project.url === url) {
                proccesedProjects.push(project);
              }
            });

            set_projects(proccesedProjects);
          })
      }
    },
    []
  )

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
                  {name}
            </h6>
                <small className="d-flex pt-2 align-items-center">
                  <a href="#/" onClick={(e) => e.preventDefault()}>
                    {url}
                  </a>
                </small>
              </div>
            </div>
            <div className="px-3 pb-3">
              <div className="bg-white">
                <PerfectScrollbar>
                  <div className="p-3">
                    {projects ? projects.map((project, i) => (
                      <div>
                        <div className="d-flex justify-content-between">
                          <div>
                            <div className="font-weight-bold">
                              <Link
                                to={'/PageProjectDetails' + project.code_hash}
                                className="text-black">
                                {project.name}
                              </Link>
                            </div>
                            <small className="d-flex pt-2 align-items-center">
                              <a href="#/" onClick={(e) => e.preventDefault()}>
                                codehash: {project.code_hash}
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
                    )) : ''}
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
