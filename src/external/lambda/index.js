const { updateReport } = require('../../usecases/updateReport');
const { env } = require('process');

const handler = async (event, context) => {
    const organization = env['ORGANIZATION'];
    await updateReport(organization);
};

module.exports = {
    handler,
};
