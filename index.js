const { createNewReport } = require('./src/usecases/createNewReport')
const { updateReport } = require('./src/usecases/updateReport')
const { argv } = require('process');

const organization = argv[2]
const credentials = argv[3]
const report = argv[4]

if(report) {
    updateReport({organization, credentials, report});
    return
}

createNewReport({organization, credentials});
