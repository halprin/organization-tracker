const { createNewReport } = require('./src/usecases/createNewReport')
const { argv } = require('process');

const organization = argv[2]
const credentials = argv[3]

createNewReport({organization, credentials})
