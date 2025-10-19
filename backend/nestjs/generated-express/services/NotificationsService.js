/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Registra token per notifiche push
*
* notificationsSubscribePostRequest NotificationsSubscribePostRequest 
* no response value expected for this operation
* */
const notificationsSubscribePOST = ({ notificationsSubscribePostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        notificationsSubscribePostRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  notificationsSubscribePOST,
};
