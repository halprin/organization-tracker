const { createReport } = require('./src/usecases/createReport')
const { argv } = require('process');

const organization = argv[2]
const credentials = argv[3]

createReport({organization, credentials})
