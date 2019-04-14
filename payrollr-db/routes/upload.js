const express = require('express');
const models = require('../models');
const asyncWrapper = require('../utils/asyncWrapper');
const helpers = require('../utils/helpers');
const router = express.Router();

const insertTimeReports = async data => {
  const timeReports = data.reduce((arr, val) => {
    const [d, m, y] = val[0].split('/').map(item => parseInt(item));
    const date = new Date(y, m - 1, d);
    const timeReport = {
      date: date,
      hours_worked: parseFloat(val[1]),
      employee_id: parseInt(val[2]),
      job_group: val[3]
    };
    arr.push(timeReport);
    return arr;
  }, []);
  const [err, _] = await asyncWrapper(
    models.TimeReports.bulkCreate(timeReports)
  );
  if (err) {
    console.log(err);
  }
  return timeReports;
};

const createPayrollReport = (timeReports, wages, reportId) => {
  const payrollReport = {};
  timeReports.forEach(report => {
    const employeeId = report.employee_id;
    const payPeriod = helpers.dateToPayPeriod(report.date);
    const amountPaid = report.hours_worked * wages[report.job_group];
    const key =
      employeeId + '-' + payPeriod.startDate.toISOString().slice(0, 10);
    if (payrollReport[key] === undefined) {
      payrollReport[key] = {
        employee_id: employeeId,
        pay_period_start: payPeriod.startDate,
        pay_period_end: payPeriod.endDate,
        amount_paid: amountPaid,
        report_id: reportId
      };
    } else {
      payrollReport[key].amount_paid += amountPaid;
    }
  });

  return payrollReport;
};

const insertPayrollReports = async reports => {
  const payrollReportArray = Object.keys(reports).map(k => reports[k]);
  return await asyncWrapper(models.Payroll.bulkCreate(payrollReportArray));
};

// POST a new time report
router.post('/', async (req, res, next) => {
  let [err, timeReports] = await asyncWrapper(insertTimeReports(req.body.data));
  if (err) {
    console.log(err);
  }
  const reportId = parseInt(req.body.reportId);
  const payrollReports = createPayrollReport(
    timeReports,
    req.app.locals.WAGES,
    reportId
  );
  await asyncWrapper(insertPayrollReports(payrollReports));

  // Return all payroll reports in the system
  models.Payroll.findAll({
    order: [['employee_id', 'ASC'], ['pay_period_start', 'ASC']]
  }).then(reports => {
    res.json(reports);
  });
});

module.exports = router;
