/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Recupera profilo donatore
*
* donorId String 
* returns Donor
* */
const donorsDonorIdGET = ({ donorId }) => new Promise(
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
/**
* Aggiorna dati donatore
*
* donorId String 
* donorUpdate DonorUpdate 
* no response value expected for this operation
* */
const donorsDonorIdPUT = ({ donorId, donorUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        donorId,
        donorUpdate,
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
  donorsDonorIdGET,
  donorsDonorIdPUT,
};
