/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Disponibilità (slots) per centro
*
* centerId String 
* dateUnderscorefrom date  (optional)
* dateUnderscoreto date  (optional)
* returns List
* */
const centersCenterIdAvailabilityGET = ({ centerId, dateUnderscorefrom, dateUnderscoreto }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        centerId,
        dateUnderscorefrom,
        dateUnderscoreto,
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
* Lista centri (filtro per regione/coordinate/tipo)
*
* lat Double  (optional)
* lng Double  (optional)
* radiusUnderscorekm Integer  (optional)
* region String  (optional)
* returns List
* */
const centersGET = ({ lat, lng, radiusUnderscorekm, region }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        lat,
        lng,
        radiusUnderscorekm,
        region,
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
  centersCenterIdAvailabilityGET,
  centersGET,
};
