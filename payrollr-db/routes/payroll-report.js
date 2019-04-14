const express = require('express');
const models = require('../models');
const router = express.Router();

// GET payroll report
router.get('/', (req, res) => {
  models.Payroll.findAll({
    order: [['employee_id', 'ASC'], ['pay_period_start', 'ASC']]
  }).then(reports => {
    res.json(reports);
  });
});

// GET count of payroll report with specified report id
router.get('/:id/count', (req, res) => {
  models.Payroll.count({ where: { report_id: req.params.id } }).then(c => {
    res.send({ count: c });
  });
});

module.exports = router;
