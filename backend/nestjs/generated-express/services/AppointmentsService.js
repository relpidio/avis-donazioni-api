/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Annulla prenotazione
*
* appointmentId String 
* no response value expected for this operation
* */
const appointmentsAppointmentIdDELETE = ({ appointmentId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        appointmentId,
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
* Reagenda prenotazione
*
* appointmentId String 
* appointmentUpdate AppointmentUpdate 
* no response value expected for this operation
* */
const appointmentsAppointmentIdPUT = ({ appointmentId, appointmentUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        appointmentId,
        appointmentUpdate,
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
* Lista appuntamenti del donatore
*
* returns List
* */
const appointmentsGET = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
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
* Crea prenotazione
*
* appointmentCreate AppointmentCreate 
* returns Appointment
* */
const appointmentsPOST = ({ appointmentCreate }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        appointmentCreate,
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
  appointmentsAppointmentIdDELETE,
  appointmentsAppointmentIdPUT,
  appointmentsGET,
  appointmentsPOST,
};
