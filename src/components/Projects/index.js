import React, { useState } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';

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
  const [projects] = useState(projectsData);

  return (
    <>
      <div className="card-header-alt d-flex justify-content-between p-4">
        <div>
          <h6 className="font-weight-bold font-size-lg mb-1 text-black">
            Projects
            </h6>
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
    </>
  );
}
