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

const auditorsData = [
  {
    accountId: 'Quantstamp',
    imageUrl: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/menjwre5yhfmkkdcm1i8'
  },
  {
    accountId: 'Iosiro',
    imageUrl: 'https://pbs.twimg.com/profile_images/1232227579618189312/RX9VtDIU.png'
  },
  {
    accountId: 'Hacken',
    imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAdVBMVEUAAAAr4rMs6Lgs5bUTUEEnzaIovZYLNSsEIhoisYwaiGws57cq260lxZwIOCsVdFwSXUoJKiIYe2EGDwwajXAel3gVbFYbgGYenn0OOi8NRTcFFRISZlAt770q3rADBwYQVUMIHxko0qcLPzEJKSEgrIgdmnphoXoBAAACwElEQVR4nO3c4W7aMBhG4doGMjCMQUNoS5t2lPX+L3Ei/pwJtxHSYifeOM+/V4OsR0iFjCx3dwAAAAAAAAAAAAAAAAAAAMBf2uy3jSfZT27uC9nPbm9f/XZ+dB6wcg+YyCzcrh5lv8nxf8peu11FjbowedFnL6XsUrZPWGm372XXbh+7jncvz5/JrmTvZT/I9sXXjtffRKszvZC9kN0WmmZbX7hsppl2He/VPd/OZVdyvLbQuu0Lrx2vPwopDFFIYXwUUhiikML4KKQwRCGF8VFIYYhCCuOjkMIQhf9M4arzgO75xhc+y/G2sj+k0H9rkGuhUssu8ue1zLpjXz48x8K4KKSQQgovCs3/Xnis48qvMLb83vFjo7A/CinsK5/CVH9/NoXm/XsSRTaFSieSzTt+YhRSSOGNF2qb1PiFu3la9eiFqY3/jp8ahf1RmBqF/d1Mod2dirPTTr7fW2+KIZwGK1RWztfkQ0ay88HRzg9HRiGFFI5viEIzkLbpYg9QaKazYfjLS/werLC9Zim1mXvV9EH28J/aUvOFG9kU9kdhbBTGdzOFtjx8S8p/hzxaYXt+mMjLevTCxDSFFFJIoUp2gphP4XGVxjGXwmTnh2udS2GqT21bCinsjcK+KBys0Pyq1lH5uwpmU6hM5PPBj+wKI7M7CimkkMJPhf53qT+hk397s+rr3fmr1+ZaaGaL8mwhP4F5KN2W8ztVCgmcLsqvyf+3z6+w/UxTyhVD77LlKujaP14K55+P5BQ690J/TZS/c3JQeLhW+EghhdFRSGGIQgrjo5DCEIUUxkchhSEKKYyPQgpDFFIY3w0W6svCafMTGSXz4K7jstcKdWehDQpN+sLm5n62LTRut69hc/PYeinz4O4lW3cXGndr2bbQuuO1hcrtP69hc2/BhIUAAAAAAAAAAAAAAAAAAAAAsvcbRs+ulBeJzKYAAAAASUVORK5CYII='
  },
  {
    accountId: 'Trailofbits',
    imageUrl: 'https://avatars1.githubusercontent.com/u/2314423?s=200&v=4'
  },
  {
    accountId: 'OpenZeppelin',
    imageUrl: 'https://openzeppelin.com/images/card.jpg'
  }
];

export default function Auditors() {
  const classes = useStyles();
  const [auditors, set_auditors] = useState(auditorsData);

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
              {auditors.map((auditor, i) => (
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
              ))}
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </>
  );
}
