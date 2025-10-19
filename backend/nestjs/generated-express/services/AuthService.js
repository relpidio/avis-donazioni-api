/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Login (email + password) / SSO
*
* loginRequest LoginRequest 
* returns _auth_login_post_200_response
* */
const authLoginPOST = ({ loginRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        loginRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Registra un nuovo donatore
*
* registerRequest RegisterRequest 
* returns Donor
* */
const authRegisterPOST = ({ registerRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        registerRequest,
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
  authLoginPOST,
  authRegisterPOST,
};
