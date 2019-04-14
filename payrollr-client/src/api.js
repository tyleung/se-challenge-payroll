import axios from 'axios';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

const API_URL = process.env.REACT_APP_API_URL;

const getFormattedData = responseData => {
  const data = [];
  responseData.forEach(item => {
    const payPeriod = item.pay_period_start + ' - ' + item.pay_period_end;
    const obj = {
      employeeId: item.employee_id,
      payPeriod: payPeriod,
      amountPaid: item.amount_paid
    };
    data.push(obj);
  });
  return data;
};

export const getPayrollReport = () => {
  return axios
    .get(API_URL + '/payroll-report')
    .then(response => {
      return getFormattedData(response.data);
    })
    .catch(error => {
      console.log(error);
    });
};

export const upload = file => {
  let data = new FormData();
  data.set('file', file);
  return axios
    .post(API_URL + '/upload', data)
    .then(response => {
      return getFormattedData(response.data);
    })
    .catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response);
        if (error.response.data.message) {
          toastr.error(error.response.data.message);
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
};
