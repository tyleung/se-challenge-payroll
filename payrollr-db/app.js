const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const models = require('./models');

// Constants
const HOST = '0.0.0.0';
const PORT = 3002;
const WAGES = { A: 20, B: 30 };

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
