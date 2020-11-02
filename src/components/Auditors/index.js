import React, { useState } from 'react';

import { Button } from '@material-ui/core';

import PerfectScrollbar from 'react-perfect-scrollbar';

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
  const [auditors] = useState(auditorsData);

  return (
    <>
      <div className="card-header-alt d-flex justify-content-between p-4">
        <div>
          <h6 className="font-weight-bold font-size-lg mb-1 text-black">
            Auditors
            </h6>
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="bg-white">
          <PerfectScrollbar>
            <div className="p-3">
              {auditors.map((auditor, i) => (
                <div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="font-weight-bold">
                        <a
                          href="#/"
                          onClick={(e) => e.preventDefault()}
                          className="text-black">
                          {auditor.accountId}
                        </a>
                      </div>
                    </div>
                    <div>
                      <Button size="small" className="btn-neutral-dark ml-4">
                        View
                      </Button>
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
