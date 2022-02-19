const { githubOrganizationProvider } = require('../external/organizationProviders/github')
const { readInCsv, writeOutToCsv } = require('../external/spreadsheetProviders/csv')
const { readInGoogle, writeOutToGoogle } = require('../external/spreadsheetProviders/google')

const updateReport = async ({organization, report, credentials}) => {
    console.log(`Getting user information for organization ${organization}`);

    const freshUserInformation = await githubOrganizationProvider({organization, credentials});

    console.log('Got user information');

    console.log(`Reading the report`);

    const reportUserInformation = await readInGoogle();

    console.log(`Finished reading the report`);

    console.log('Splicing the user information');

    const userInformation = spliceUserInformation(freshUserInformation, reportUserInformation);

    console.log('Writing out user information');

    await writeOutToGoogle(userInformation);

    console.log('Wrote out user information');
};

const spliceUserInformation = (freshUserInformation, reportUserInformation) => {

    Object.keys(freshUserInformation).forEach(key => {
        if(freshUserInformation[key]) {
            //the fresh data has a name, but check if the existing data already has a name and continue using that
            if(reportUserInformation[key]) {
                freshUserInformation[key] = reportUserInformation[key]
            }
        } else {
            //the name isn't filled in the new data, grab it from the existing report
            freshUserInformation[key] = reportUserInformation[key];
        }
    });

    return freshUserInformation;
};

module.exports = {
    updateReport,
};
