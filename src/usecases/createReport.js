const { githubOrganizationProvider } = require('../external/organizationProviders/github')
const { writeOutToCsv } = require('../external/spreadsheetProviders/csv')

const createReport = async ({organization, credentials}) => {
    console.log(`Getting user information for organization ${organization}`);

    const userInformation = await githubOrganizationProvider({organization, credentials});

    await writeOutToCsv(userInformation);
};

module.exports = {
    createReport,
};
