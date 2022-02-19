const { updateReport } = require('./src/usecases/updateReport')
const { env } = require('process');

const organization = env['ORGANIZATION'];

updateReport(organization);
