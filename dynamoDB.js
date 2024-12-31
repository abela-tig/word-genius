const AWS = require("aws-sdk");
const fs = require("fs/promises");
// Configure DynamoDB
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const TABLE_NAME = "gameLevels";
//create table

// const gameLevelsTable = {
//   TableName: TABLE_NAME,
//   KeySchema: [
//     { AttributeName: "level", KeyType: "HASH" }, // Partition key
//   ],
//   AttributeDefinitions: [
//     { AttributeName: "level", AttributeType: "N" }, // Number type
//   ],
//   ProvisionedThroughput: {
//     ReadCapacityUnits: 5,
//     WriteCapacityUnits: 5,
//   },
// };
// // Create the table
// async function createGameLevelsTable() {
//   try {
//     const dynamodb = new AWS.DynamoDB();
//     const result = await dynamodb.createTable(gameLevelsTable).promise();
//     console.log("Table created successfully:", result);
//   } catch (error) {
//     console.error("Error creating table:", error);
//   }
// }

// createGameLevelsTable();

// Migrate Data from JSON

// async function migrateData() {
//   try {
//     const levels = JSON.parse(
//       await fs.readFile("level_data.json", "utf-8")
//     ).map((level, i) => {
//       return {
//         level: i + 1,
//         chars: level.chars,
//         commonWords: level.commonWords,
//       };
//     });
//     //   console.log("levels", levels);
//     await Promise.all(
//       levels.map(async (level) => {
//         await dynamoDb
//           .put({
//             TableName: TABLE_NAME,
//             Item: level,
//           })
//           .promise();
//       })
//     );
//   } catch (error) {
//     console.error("Error migrating data:", error);
//   }
// }

// migrateData();

// Logging Data

// async function logData() {
//   try {
//     const data = await dynamoDb.scan({ TableName: TABLE_NAME }).promise();
//     const sortedItems = data.Items.sort((a, b) => a.level - b.level); // Sort by level (ascending)
//     console.log(sortedItems);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }

// logData();
module.exports = { dynamoDb, TABLE_NAME };
