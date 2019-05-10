const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const models = require('./models');

// Constants
const HOST = '0.0.0.0';
const PORT = 3002;

const wages_db = { [id: 1, 'job_group': 'A', 'val': 20, 'start_date': null] }
const WAGES = { A: {default_val: 20, new_val: 30, new_date: '01/12/2019'}, B: 30 };

app.locals.WAGES = WAGES;
app.use(cors());

app.use(bodyParser({ type: '*/*' }));
app.use('/', require('./routes/index'));
app.use('/payroll-report', require('./routes/payroll-report'));
app.use('/upload', require('./routes/upload'));

// Automatically create database tables for our Sequelize models then start the
// HTTP server.
models.sequelize.sync().then(function() {
  app.listen(PORT, HOST, () =>
    console.log(`payrollr-db listening on http://${HOST}:${PORT}`)
  );
});
