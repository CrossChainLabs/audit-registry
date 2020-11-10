import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import PerfectScrollbar from 'react-perfect-scrollbar';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const projectsData = [
  {
    name: 'near-cli',
    codehash: '0x3663ba',
    url: 'https://github.com/near/near-cli',
    completed: true
  },
  {
    name: 'nearup',
    codehash: '0xab87ba',
    url: 'https://github.com/near/nearup',
    completed: true
  },
  {
    name: 'go-ethereum',
    codehash: '0xaa63ba',
    url: 'https://github.com/ethereum/go-ethereum',
    completed: false
  },
  {
    name: 'solidity',
    codehash: '0x6763cc',
    url: 'https://github.com/ethereum/solidity',
    completed: true
  },
  {
    name: 'eth-utils',
    codehash: '0x7763af',
    url: 'https://github.com/ethereum/eth-utils',
    completed: false
  },
  {
    name: 'evmone',
    codehash: '0x4663dd',
    url: 'https://github.com/ethereum/evmone',
    completed: true
  }
];

export default function Projects() {
  const classes = useStyles();
  const [projects] = useState(projectsData);

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
              {projects.map((project, i) => (
                <div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="font-weight-bold">
                        <Link
                          to='/PageProjectHistory'
                          className="text-black">
                          {project.name}
                        </Link>
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
    </>
  );
}
