const { updateReport } = require('../../usecases/updateReport');
const { env } = require('process');

const handler = async (event, context) => {
    const organization = env['ORGANIZATION'];
    updateReport(organization);
};

module.exports = {
    handler,
};
