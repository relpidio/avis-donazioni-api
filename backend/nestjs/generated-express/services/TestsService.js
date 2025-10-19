/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Elenco risultati esami del donatore (PDF/valori)
*
* donorId String 
* returns List
* */
const donorsDonorIdTestsGET = ({ donorId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        donorId,
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
  donorsDonorIdTestsGET,
};
