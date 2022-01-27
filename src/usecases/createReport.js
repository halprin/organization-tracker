const createReport = async ({organizationName, githubPersonalAccessToken}) => {
    console.log(`organizationName=${organizationName}`)
    console.log(`githubPersonalAccessToken=${githubPersonalAccessToken}`)
};

module.exports = {
    createReport,
};
