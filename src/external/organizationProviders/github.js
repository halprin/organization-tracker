const { env } = require('process');
const axios = require('axios');

/*
Returns an object of {username: name, ...}
 */
const githubOrganizationProvider = async (organization) => {

    const credentials = env['GITHUB_CREDENTIALS'];

    let currentUserList = [];
    let totalUserList = [];
    let pageNumber = 1;

    do {
        currentUserList = await getPageOfUsers(organization, pageNumber, credentials);
        totalUserList = totalUserList.concat(currentUserList);
        pageNumber++;
    } while(currentUserList.length > 0);

    const rawUserInformation = await Promise.all(totalUserList.map(user => user.url).map(async url => getGitHubUser(url, credentials)));

    let userInformation = {};
    rawUserInformation.forEach(user => {
        userInformation[user.login] = user.name;
    });

    return userInformation;
}

const getPageOfUsers = async (organization, pageNumber, credentials) => {
    const response = await axios.get(`https://api.github.com/orgs/${organization}/members?per_page=30&page=${pageNumber}`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${credentials}`,
        },
    });

    return response.data;
}

const getGitHubUser = async (url, credentials) => {
    const response = await axios.get(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${credentials}`,
        },
    });

    return response.data;
}

module.exports = {
    githubOrganizationProvider,
};
