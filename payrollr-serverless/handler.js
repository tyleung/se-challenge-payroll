import axios from 'axios';
import multipart from 'aws-lambda-multipart-parser';
import Papa from 'papaparse';

const DB_URL = process.env.DB_URL;

export const hello = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v1.0! ${await message({
        time: 1,
        copy: 'Your function executed successfully!'
      })}`
    })
  };
};

export const getPayrollReport = async (event, context) => {
  // Get payroll report
  return axios.get(DB_URL + '/payroll-report').then(response => {
    return {
      statusCode: 200,
      body: response.data
    };
  });
};

const parsePromise = file => {
  let data;
  return new Promise(resolve => {
    Papa.parse(file, {
      header: false,
      complete: (results, file) => {
        console.log('Parsing complete');
        data = results.data;
      },
      skipEmptyLines: true
    });
    resolve(data);
  });
};

const getPayrollReportCountById = id => {
  return axios.get(DB_URL + `/payroll-report/${id}/count`).then(response => {
    return {
      statusCode: 200,
      body: response.data
    };
  });
};

const uploadToDb = (data, reportId) => {
  return axios
    .post(DB_URL + `/upload`, { data, reportId })
    .then(response => response.data);
};

export const upload = async (event, context) => {
  const parsedEvent = multipart.parse(event);
  const data = await parsePromise(parsedEvent.file.content);
  const headers = data.shift();
  const footer = data.pop();
  const reportId = footer[1];
  const res = await getPayrollReportCountById(reportId);
  if (res.body.count > 0) {
    return new Promise(resolve => {
      resolve({
        isBase64Encoded: false,
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          message: `Report id ${reportId} already exists.`
        })
      });
    });
  }

  const payrollData = await uploadToDb(data, reportId);
  return {
    statusCode: 200,
    body: payrollData
  };
};

const message = ({ time, ...rest }) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(`${rest.copy} (with a delay)`);
    }, time * 1000)
  );
