const { githubOrganizationProvider } = require('../external/organizationProviders/github')

const createReport = async ({organization, credentials}) => {
    console.log(`organization=${organization}`)
    await githubOrganizationProvider({organization, credentials})
};

module.exports = {
    createReport,
};
