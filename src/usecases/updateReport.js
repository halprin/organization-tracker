const { githubOrganizationProvider } = require('../external/organizationProviders/github')
const { dockerOrganizationProvider } = require('../external/organizationProviders/docker')
const { readInGoogle, writeOutToGoogle } = require('../external/spreadsheetProviders/google')

const updateReport = async (organization) => {
    console.log(`Getting user information for organization ${organization}`);

    const githubUserInformationPromise = githubOrganizationProvider(organization);
    const dockerUserInformationPromise = dockerOrganizationProvider(organization);
    const githubUserInformation = await githubUserInformationPromise;
    const dockerUserInformation = await dockerUserInformationPromise;

    console.log('Got user information');

    console.log(`Reading the report`);

    const reportUserInformation = await readInGoogle();

    console.log(`Finished reading the report`);

    console.log('Splicing the user information');

    const combinedGithubUserInformation = spliceUserInformation(githubUserInformation, reportUserInformation['github']);
    const combinedDockerUserInformation = spliceUserInformation(dockerUserInformation, reportUserInformation['docker']);

    console.log('Writing out user information');

    await writeOutToGoogle({
        'github': combinedGithubUserInformation,
        'docker': combinedDockerUserInformation,
    });

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
