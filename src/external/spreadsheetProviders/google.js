const { env } = require('process');
const { google } = require('googleapis');

const writeOutToGoogle = async (userInformation) => {
    const sheets = await createSheetsService();

    const spreadsheetId = env['GOOGLE_SHEET_ID'];

    const usernames = Object.keys(userInformation);

    const values = usernames.map(username => {
        const name = userInformation[username];

        return [username, name];
    });

    await writeOutData(`Sheet1!A1:B${usernames.length}`, values, spreadsheetId, sheets);

    await clearOutRemainingOldData(userInformation, spreadsheetId, sheets);
};

const readInGoogle = async () => {
    const sheets = await createSheetsService();

    const spreadsheetId = env['GOOGLE_SHEET_ID'];

    let startRange = 1;
    let endRange = 10;
    let range = `Sheet1!A${startRange}:B${endRange}`;

    let allData = [];
    let additionalData = (await readRange(spreadsheetId, range, sheets));

    while(additionalData.values) {
        allData = allData.concat(additionalData.values);

        startRange = endRange + 1;
        endRange = (startRange + 1) * 2;
        range = `Sheet1!A${startRange}:B${endRange}`;

        additionalData = await readRange(spreadsheetId, range, sheets);
    }

    const userInformation = allData.reduce((previousValue, currentValue) => {
        const username = currentValue[0];
        const name = currentValue[1];

        previousValue[username] = name;

        return previousValue;
    }, {});

    return userInformation;
};

const readRange = async (spreadsheetId, range, sheets) => {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    return response.data;
};

const createSheetsService = async () => {
    const base64Credentials = env['GOOGLE_CREDENTIALS'];

    const credentials = JSON.parse(new Buffer(base64Credentials, 'base64').toString());

    const auth = new google.auth.GoogleAuth({
        credentials,
        projectId: credentials.project_id,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({
        version: 'v4',
        auth,
    });
};

const writeOutData = async (range, values, spreadsheetId, sheets) => {

    await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
            valueInputOption: 'RAW',
            data: [{
                range,
                values,
            }],
        },
    });
};

const clearOutRemainingOldData = async (userInformation, spreadsheetId, sheets) => {
    let startRange = Object.keys(userInformation).length + 1;
    let endRange = (startRange + 1) * 2;
    let range = `Sheet1!A${startRange}:B${endRange}`;
    let additionalData = await readRange(spreadsheetId, range, sheets);

    while(additionalData.values) {
        await sheets.spreadsheets.values.clear({
            spreadsheetId,
            range,
        });

        startRange = endRange + 1;
        endRange = (startRange + 1) * 2;
        range = `Sheet1!A${startRange}:B${endRange}`;

        additionalData = await readRange(spreadsheetId, range, sheets);
    }
};

module.exports = {
    writeOutToGoogle,
    readInGoogle,
};
