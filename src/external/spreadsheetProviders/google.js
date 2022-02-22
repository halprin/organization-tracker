const { env } = require('process');
const { google } = require('googleapis');

//wants { github: { username: 'real name', ... }, ... }
const writeOutToGoogle = async (userInformation) => {
    const sheets = await createSheetsService();

    const spreadsheetId = env['GOOGLE_SHEET_ID'];

    const sheetNames = Object.keys(userInformation);

    await Promise.all(sheetNames.map(sheetName => writeSheet(spreadsheetId, sheetName, userInformation[sheetName], sheets)));
};

const writeSheet = async (spreadsheetId, sheetName, sheetSpecificUserInformation, sheets) => {
    console.log(`Writing out sheet ${sheetName}`);

    await createSheetNameIfNotExist(spreadsheetId, sheetName, sheets);

    const usernames = Object.keys(sheetSpecificUserInformation);

    const values = usernames.map(username => {
        const name = sheetSpecificUserInformation[username];

        return [username, name];
    });

    await writeOutData(`${sheetName}!A1:B${usernames.length}`, values, spreadsheetId, sheets);

    await clearOutRemainingOldData(sheetSpecificUserInformation, spreadsheetId, sheetName, sheets);
};

const createSheetNameIfNotExist = async (spreadsheetId, sheetName, sheets) => {
    const sheetNames = await readSheetNames(spreadsheetId, sheets);

    if(sheetNames.includes(sheetName)) {
        //the sheet already exists, nothing to do, return
        return;
    }

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    addSheet: {
                        properties: {
                            title: sheetName,
                        },
                    },
                }
            ],
        },
    });
};

//returns { github: { username: 'real name', ... }, ... }
const readInGoogle = async () => {
    const sheets = await createSheetsService();

    const spreadsheetId = env['GOOGLE_SHEET_ID'];

    const sheetNames = await readSheetNames(spreadsheetId, sheets);

    const readSheets = await Promise.all(sheetNames.map(sheetName => readSheet(spreadsheetId, sheetName, sheets)));

    return sheetNames.reduce((previousValue, sheetName, sheetIndex) => {
        previousValue[sheetName] = readSheets[sheetIndex];
        return previousValue;
    }, {});
};

const readSheetNames = async (spreadsheetId, sheets) => {
    const response = await sheets.spreadsheets.get({
        spreadsheetId,
    });

    // console.log('response', response);

    return response.data.sheets.map(sheet => sheet.properties.title);
};

const readSheet = async (spreadsheetId, sheetName, sheets) => {
    console.log(`Reading in sheet ${sheetName}`);

    let startRange = 1;
    let endRange = 10;
    let range = `${sheetName}!A${startRange}:B${endRange}`;

    let allData = [];
    let additionalData = (await readRange(spreadsheetId, range, sheets));

    while(additionalData.values) {
        allData = allData.concat(additionalData.values);

        startRange = endRange + 1;
        endRange = (startRange + 1) * 2;
        range = `${sheetName}!A${startRange}:B${endRange}`;

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

    const credentials = JSON.parse(Buffer.from(base64Credentials, 'base64').toString());

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

const clearOutRemainingOldData = async (userInformation, spreadsheetId, sheetName, sheets) => {
    let startRange = Object.keys(userInformation).length + 1;
    let endRange = (startRange + 1) * 2;
    let range = `${sheetName}!A${startRange}:B${endRange}`;
    let additionalData = await readRange(spreadsheetId, range, sheets);

    while(additionalData.values) {
        await sheets.spreadsheets.values.clear({
            spreadsheetId,
            range,
        });

        startRange = endRange + 1;
        endRange = (startRange + 1) * 2;
        range = `${sheetName}!A${startRange}:B${endRange}`;

        additionalData = await readRange(spreadsheetId, range, sheets);
    }
};

module.exports = {
    writeOutToGoogle,
    readInGoogle,
};
