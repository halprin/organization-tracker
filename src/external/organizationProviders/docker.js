const { env } = require('process');
const axios = require('axios');

/*
Returns an object of {username: name, ...}
 */
const dockerOrganizationProvider = async (organization) => {
    console.log(`Reading organization ${organization} from Docker`);

    const credentials = await login();

    let currentUserList = [];
    let totalUserList = [];
    let pageNumber = 1;

    do {
        currentUserList = await getPageOfUsers(organization, pageNumber, credentials);
        totalUserList = totalUserList.concat(currentUserList);
        pageNumber++;
    } while(currentUserList.length > 0);

    const userInformation = totalUserList.reduce((previousValue, currentValue) => {
        previousValue[currentValue.username] = currentValue.full_name;
        return previousValue;
    }, {});

    return userInformation;
};

const login = async () => {
    const username = env['DOCKER_USERNAME'];
    const password = env['DOCKER_PASSWORD'];

    const response = await axios.post('https://hub.docker.com//v2/users/login', {
        username,
        password,
    });

    return response.data.token;
};

const getPageOfUsers = async (organization, pageNumber, credentials) => {
    try {
        const response = await axios.get(`https://hub.docker.com/v2/orgs/${organization}/members/?page_size=30&page=${pageNumber}`, {
            headers: {
                'Authorization': `Bearer ${credentials}`,
            },
        });

        return response.data.results;
    } catch (e) {
        if(e.response.status !== 404) {
            //Some other error from DockerHub.  Log the error.
            console.log('Error getting DockerHub users,', `response status=${e.response.status},`, `response body=${JSON.stringify(e.response.data)}`);
        }

        //Docker API returns a 404 if not a single user would be returned given the `page_size` and `page` parameters
        //catch the error and return an empty list
        return [];
    }
};

module.exports = {
    dockerOrganizationProvider,
};
