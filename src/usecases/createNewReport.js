const { githubOrganizationProvider } = require('../external/organizationProviders/github')
const { writeOutToCsv } = require('../external/spreadsheetProviders/csv')
const { writeOutToGoogle } = require('../external/spreadsheetProviders/google')

const createNewReport = async ({organization, credentials}) => {
    console.log(`Getting user information for organization ${organization}`);

    const userInformation = await githubOrganizationProvider({organization, credentials});

    console.log('Got user information');

    console.log('Writing out user information');

    await writeOutToGoogle(userInformation);

    console.log('Wrote out user information');
};

module.exports = {
    createNewReport,
};
