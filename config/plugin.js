'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  cors: {
    enable: true,
    package: 'egg-cors'
  },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  }
};
