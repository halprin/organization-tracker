const githubOrganizationProvider = require('../external/organizationProviders/github')
const dockerOrganizationProvider = require('../external/organizationProviders/docker')
const { readInGoogle, writeOutToGoogle } = require('../external/spreadsheetProviders/google')

const updateReport = async (organization) => {
    console.log(`Getting user information for organization ${organization}`);

    const providers = [githubOrganizationProvider, dockerOrganizationProvider];

    const dispersedUserInformationPromises = providers.map(async organizationProvider => {
        const id = await organizationProvider.id();
        const userInformation = await organizationProvider.readOrganization(organization);
        return [id, userInformation];
    });

    const dispersedUserInformation = await Promise.all(dispersedUserInformationPromises);

    const freshUserInformation = dispersedUserInformation.reduce((previousValue, currentValue) => {
        const id = currentValue[0];
        const userInformation = currentValue[1];
        previousValue[id] = userInformation;

        return previousValue;
    },{});

    console.log('Got user information');

    console.log(`Reading the report`);

    const reportUserInformation = await readInGoogle();

    console.log(`Finished reading the report`);

    console.log('Splicing the user information');

   const combinedUserInformation = Object.keys(freshUserInformation).reduce((previousValue, userInformationKey) => {
        const specificFreshUserInformation = freshUserInformation[userInformationKey];
        const specificReportUserInformation = reportUserInformation[userInformationKey] || {};  //if nothing in the report, default to an empty object

        const combinedUserInformation = spliceUserInformation(specificFreshUserInformation, specificReportUserInformation);
        if(Object.keys(combinedUserInformation).length === 0) {
            //the combined user information is empty
            //highly unlikely the organization size went all the way to 0, so ignore this change by not adding it
            console.log(`Ignoring ${userInformationKey} update because organization size was 0`)
            return previousValue;
        }

       previousValue[userInformationKey] = combinedUserInformation;

        return previousValue;
    }, {});

    console.log('Writing out user information');

    await writeOutToGoogle(combinedUserInformation);

    console.log('Wrote out user information');
};

const spliceUserInformation = (freshUserInformation, reportUserInformation) => {

    if(!reportUserInformation) {
        //the existing report doesn't even exist (happens when the spreadsheet for this data may not even exist)
        //just return the fresh user information
        return freshUserInformation;
    }

    Object.keys(freshUserInformation).forEach(key => {
        if(freshUserInformation[key]) {
            //the fresh data has a name, but check if the existing data already has a name and continue using that
            if(reportUserInformation[key]) {
                freshUserInformation[key] = reportUserInformation[key]
            }
        } else {
            //the name isn't filled in the new data, grab it from the existing report (if it exists there also)
            freshUserInformation[key] = reportUserInformation[key];
        }
    });

    return freshUserInformation;
};

module.exports = {
    updateReport,
};
