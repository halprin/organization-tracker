const { stringify } = require('csv-stringify');
const { parse } = require('csv-parse');
const fs = require('fs');
const { finished } = require('stream/promises');

const writeOutToCsv = async (userInformation) => {

    const arrayUserInformation = convertUserInfoObjectToArray(userInformation);

    const csvFile = fs.createWriteStream('userInformation.csv');

    stringify(arrayUserInformation, {
            header: true,
            columns: [
                { key: 'key', header: 'Username' },
                { key: 'value', header: 'Name' },
            ],
        })
        .pipe(csvFile);
};

const readInCsv = async (report) => {

    let userInformation = {};

    const csvFile = fs.createReadStream(report);

    const csvParser = csvFile.pipe(parse({
        columns: ['key', 'value'],
        from: 2,
    })).on('data', data => userInformation[data.key] = data.value);

    await finished(csvParser);

    return userInformation;
};

const convertUserInfoObjectToArray = (userInformation) => {
    return Object.entries(userInformation).map(entry => {
        const [key, value] = entry;
        return {
            'key': key,
            'value': value,
        };
    });
};

module.exports = {
    writeOutToCsv,
    readInCsv,
};
