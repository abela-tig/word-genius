require("dotenv").config();
const { dynamoDb, TABLE_NAME } = require("./dynamoDB");

const express = require("express");
const path = require("path");

const app = express();

const PORT = 8000;
const apiRouter = express.Router();

app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use("/api", apiRouter);

apiRouter.get("/levels", async (req, res) => {
  console.log("GET /api/levels");
  // res.json({ count: 100 });
  try {
    const levels = await dynamoDb
      .scan({ TableName: TABLE_NAME, Select: "COUNT" })
      .promise();
    res.json({ count: levels.Count });
  } catch (err) {
    res.status(500).json({
      message: "Faild to bring levels",
    });
  }
});

apiRouter.get("/level/:level", async (req, res) => {
  console.log("GET /api/level/:level");
  // res.json({
  //   level: {
  //     charLength: 6,
  //     chars: ["i", "e", "b", "s", "u", "r"],
  //     commonWords: ["bruise", "buries", "busier", "rubies"],
  //     possibleWords: [],
  //     level: 100,
  //   },
  // });
  // return;
  try {
    const levelNo = parseInt(req.params.level);
    if (isNaN(levelNo) || levelNo < 1) {
      res.status(400).json({ message: "Invalid level number" });
      return;
    }
    const level = (
      await dynamoDb
        .query({
          TableName: TABLE_NAME,
          KeyConditionExpression: "#lvl = :level",
          ExpressionAttributeNames: {
            "#lvl": "level",
          },
          ExpressionAttributeValues: {
            ":level": parseInt(levelNo),
          },
        })
        .promise()
    ).Items[0];
    res.json({ level });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err, message: "Something went wrong!" });
  }
});
app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running on port ", PORT);
});
