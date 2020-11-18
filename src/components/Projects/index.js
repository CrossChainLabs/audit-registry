import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Badge, Button } from '@material-ui/core';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { REFRESH_INTERVAL } from '../../utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { encode } from 'js-base64';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(0),
    marginBottom: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function Projects() {
  const classes = useStyles();
  const [projects, set_projects] = useState();

  const getProjects = () => {
    if (window.walletConnection.isSignedIn()) {
      window.contract.get_projects_list()
        .then(projectsFromContract => {
          //sort
          projectsFromContract.sort((a,b) => {
            return b.index - a.index;
          })
          //extract old versions
          let proccesedProjects = [];
          projectsFromContract.forEach(project => {
            let found = proccesedProjects.find(((element, index, arr) => {
              if (element.url === project.url) {
                arr[index].versions++;
              }
              return element.url === project.url;
            }));

            if (!found) {
              proccesedProjects.push({
                code_hash: project.code_hash,
                name: project.name,
                url: project.url,
                metadata: project.metadata,
                status: project.status,
                index: project.index,
                versions: 1
              });
            }
          });

          set_projects(proccesedProjects);
        })
    }
  }

  React.useEffect(
    () => {
      getProjects();
      const interval = setInterval(() => {
        getProjects();
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    },
    []
  )

  return (
    <>
      <div className="px-3 pb-3">
        <div className="bg-white">
          <PerfectScrollbar>
            <div className="p-3">
              <div className="d-flex justify-content-between">
                <h2 className="font-weight-bold text-black">
                  Projects
                </h2>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  className={classes.margin}
                  startIcon={<AddCircleRoundedIcon />}
                  component={Link} 
                  to='/PageRegisterProject'>
                  Project
                </Button>
              </div>
              <div className="divider my-3" />
              {projects ? projects.map((project, i) => (
                <div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="font-weight-bold"> 
                        <Link to={'/PageProjectDetails/' + encode(project.url)} className="text-black">{project.name}</Link>
                      </div>
                      <small className="d-flex pt-2 align-items-center">
                        <a href={project.url + '/tree/'+ project.code_hash}>
                        <FontAwesomeIcon icon={faGithub} /> {project.code_hash}
                        </a>
                      </small>
                    </div>
                    <div>
                      <Badge className="mx-2" badgeContent={project.versions} max={99} color="primary">
                        {(project.status) ?
                          <div className="badge badge-success">Completed</div> :
                          <div className="badge badge-warning">Pending</div>
                        }
                      </Badge>
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
    </>
  );
}
