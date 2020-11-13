import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, IconButton, Badge } from '@material-ui/core';
import MoreVertRoundedIcon from '@material-ui/icons/MoreVertRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { REFRESH_INTERVAL } from '../../utils'

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(0),
    marginBottom: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function Auditors() {
  const classes = useStyles();
  const [auditors, set_auditors] = useState();

  const getAuditors = () => {
    if (window.walletConnection.isSignedIn()) {
      window.contract.get_auditors_list()
        .then(auditorsFromContract => {
          set_auditors(auditorsFromContract)
        })
    }
  }

  React.useEffect(
    () => {
      getAuditors();
      const interval = setInterval(() => {
        getAuditors();
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
                Auditors
                </h2>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  className={classes.margin}
                  startIcon={<AddCircleRoundedIcon />}
                  component={Link} 
                  to='/PageRegisterAuditor'>
                  Auditor
                </Button>
              </div>
              <div className="divider my-3" />
              {auditors ? auditors.map((auditor, i) => (
                <div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="font-weight-bold">
                        <Link
                          to='/PageAuditorDetails'
                          className="text-black">
                          {auditor.account_id}
                        </Link>
                      </div>
                    </div>
                    <div>
                      <div className="badge badge-info ml-3">
                        23 audits
                        </div>
                    </div>
                  </div>
                  { (i < auditors.length - 1) ?
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
