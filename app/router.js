'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.ylxf.index);
  router.post('/ylxf/login', controller.ylxf.login);
  router.post('/ylxf/learn', controller.ylxf.learn);
};
