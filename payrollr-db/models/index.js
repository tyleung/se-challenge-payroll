const Sequelize = require('sequelize-cockroachdb');

// Connect to CockroachDB through Sequelize.
const sequelize = new Sequelize('defaultdb', 'root', '', {
  host: 'roach1',
  dialect: 'postgres',
  port: 26257,
  logging: false
});

if (!Sequelize.supportsCockroachDB) {
  throw new Error('CockroachDB dialect for Sequelize not installed');
}

module.exports.TimeReports = sequelize.define('time_reports', {
  date: Sequelize.DATE,
  hours_worked: Sequelize.DECIMAL,
  employee_id: Sequelize.INTEGER,
  job_group: Sequelize.STRING
});

module.exports.Payroll = sequelize.define('payroll', {
  employee_id: Sequelize.INTEGER,
  pay_period_start: {
    type: Sequelize.DATE,
    get: function() {
      const start = this.getDataValue('pay_period_start');
      const startDate = new Date(start);
      const payPeriodStart = [
        startDate.getDate(),
        startDate.getMonth() + 1,
        startDate.getFullYear()
      ].join('/');
      return payPeriodStart;
    }
  },
  pay_period_end: {
    type: Sequelize.DATE,
    get: function() {
      const end = this.getDataValue('pay_period_end');
      const endDate = new Date(end);
      const payPeriodEnd = [
        endDate.getDate(),
        endDate.getMonth() + 1,
        endDate.getFullYear()
      ].join('/');
      return payPeriodEnd;
    }
  },
  amount_paid: Sequelize.DECIMAL,
  report_id: Sequelize.INTEGER
});

module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;
