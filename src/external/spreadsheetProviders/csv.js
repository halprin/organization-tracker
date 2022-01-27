const { stringify } = require('csv-stringify');
const fs = require('fs');

const writeOutToCsv = async (userInformation) => {

    let csvFile = fs.createWriteStream('userInformation.csv')

    stringify(userInformation, {
            header: true,
            columns: [
                { key: 'username', header: 'Username' },
                { key: 'name', header: 'Name' },
            ],
        })
        .pipe(csvFile);
}

module.exports = {
    writeOutToCsv,
};
