const { githubOrganizationProvider } = require('../external/organizationProviders/github')
const { writeOutToCsv } = require('../external/spreadsheetProviders/csv')

const createNewReport = async ({organization, credentials}) => {
    console.log(`Getting user information for organization ${organization}`);

    const userInformation = await githubOrganizationProvider({organization, credentials});

    console.log('Got user information');

    await writeOutToCsv(userInformation);

    console.log('Wrote out user information to userInformation.csv');
};

module.exports = {
    createNewReport,
};
