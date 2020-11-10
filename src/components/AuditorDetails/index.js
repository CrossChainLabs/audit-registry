import React from 'react';
import { Grid, Paper } from '@material-ui/core';

import PerfectScrollbar from 'react-perfect-scrollbar';

import Header from '../Header';
import ALERT from '../Alert';

const auditor =
  {
    name: 'Auditor 1',
    metadata: '0x7889aa'
  };

export default function AuditorDetails() {

  return (
    <>
      <div className="hero-wrapper bg-composed-wrapper bg-white">
        <div className="header-top-section pb-2">
          <Header />
        </div>
      </div>
      <Grid container>
      {ALERT('info', 'test')}
        <Grid container spacing={6}>
          <Grid item xs>
            <Paper />
          </Grid>
          <Grid item xl={6}>
            <div className="px-3 pb-3">
              <div className="bg-white">
                <PerfectScrollbar>
                  <div className="p-3">
                    <div>
                      <h2 className="font-weight-bold text-black">
                        {auditor.name}
                      </h2>
                    </div>
                    <div className="divider my-3" />
                    <Paper elevation={0}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin rhoncus euismod diam id bibendum. Suspendisse iaculis turpis mi, eget sodales nisl malesuada sit amet. Aliquam tempus eros velit, et faucibus nulla sodales vitae. Curabitur massa mauris, venenatis non porttitor id, aliquet et est. Donec rutrum rutrum vulputate. Aenean tristique hendrerit augue ut commodo. Nam porta ut justo convallis pulvinar. Duis ultricies tristique nisl, quis ultricies quam venenatis sit amet.
                    Morbi vestibulum urna eu semper auctor. Cras ante orci, dictum in lobortis quis, posuere sed purus. Ut vehicula egestas faucibus. Mauris finibus lobortis efficitur. Nulla pellentesque laoreet ex ac posuere. Fusce sagittis suscipit sodales. Sed eget tortor id dolor eleifend vehicula. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed dui enim, maximus ullamcorper placerat non, dignissim vel eros. Etiam hendrerit, justo ut aliquet sagittis, augue diam venenatis massa, a tristique risus nibh sed turpis. Nullam ac fermentum libero. Donec vestibulum mauris ut augue eleifend molestie. Maecenas tristique varius quam. Aliquam vel ullamcorper urna, consequat finibus justo.
                    Integer faucibus erat sed sollicitudin tempus. Sed diam libero, semper ut sagittis quis, vestibulum in lectus. In molestie quam ac ipsum fermentum laoreet. Sed maximus est quis porttitor lacinia. Aenean consectetur, elit id consectetur vestibulum, nulla ligula hendrerit metus, id gravida leo ante eu ligula. Duis id luctus turpis, sit amet blandit erat. Proin sapien felis, dictum in porttitor id, imperdiet id sapien. Ut in posuere sapien. Nulla auctor velit at tempor rhoncus.
                    Morbi ante purus, tincidunt vel faucibus et, rhoncus a nisl. Aliquam massa nulla, viverra eget aliquet ac, ultricies quis urna. Quisque blandit aliquet magna id eleifend. Morbi viverra dui at est tempus, tempor porta arcu congue. Quisque tempus magna vitae justo tincidunt finibus. Nam vulputate, sem a molestie dapibus, ex sapien bibendum magna, eget egestas leo libero in enim. Sed in leo felis.
                    In turpis nisl, cursus eget leo ac, interdum commodo massa. Ut metus odio, rutrum eget egestas in, hendrerit sed neque. Cras a velit in nisl cursus condimentum quis eget sem. Nullam imperdiet id neque eu dignissim. Vivamus ultricies turpis orci, id convallis neque auctor id. Phasellus dictum est sed ipsum pellentesque, non rhoncus tellus condimentum. Maecenas pretium enim dui, a pretium dolor sollicitudin id. Integer eget libero molestie, scelerisque odio vitae, luctus dui. Morbi tristique, nunc vel lobortis egestas, est mi rutrum magna, laoreet bibendum ipsum quam et eros. Morbi ultricies est vel est dictum auctor. Aliquam ut cursus nulla. Nam odio massa, dapibus sed quam quis, elementum posuere mauris. Vestibulum ultrices justo vel leo mollis scelerisque. Donec mauris felis, euismod quis iaculis quis, interdum et nisi. Proin ac diam nec purus dapibus auctor.
                    </Paper>
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
