import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, IconButton } from '@material-ui/core';
import MoreVertRoundedIcon from '@material-ui/icons/MoreVertRounded';
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

export default function Auditors() {
  const classes = useStyles();
  const [auditors, set_auditors] = useState();

  React.useEffect(
    () => {
      if (window.walletConnection.isSignedIn()) {
        window.contract.get_auditors_list()
          .then(auditorsFromContract => {
            set_auditors(auditorsFromContract)
          })
      }
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
                          {auditor.accountId}
                        </Link>
                      </div>
                    </div>
                    <div>
                      <IconButton aria-label="Details">
                        <MoreVertRoundedIcon />
                      </IconButton>
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
