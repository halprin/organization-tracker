const { createReport } = require('./src/usecases/createReport')
const { argv } = require('process');

const organizationName = argv[2]
const githubPersonalAccessToken = argv[3]

createReport({organizationName, githubPersonalAccessToken})
