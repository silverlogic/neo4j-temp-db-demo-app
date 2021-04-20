import express from "express";
import Neo4jTempDB from "neo4j-temp-db";
import neo4j from "neo4j-driver";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const tempDb = new Neo4jTempDB(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USER,
    process.env.NEO4J_PASSWORD
  )
);

const queries = {};

app.use('^/$', async (req, res) => {
  let { cypher, tempDbName } = req.body;
  if (!tempDbName) {
    tempDbName = await tempDb.createDatabase();
  }

  if (!queries[tempDbName]) {
    queries[tempDbName] = [];
  }

  if (cypher && tempDbName) {
    const result = await tempDb.runCypherOnDatabase(tempDbName, "3.5", cypher);
    queries[tempDbName].push({ cypher, result });
  }

  queries[tempDbName].reverse();

  res.render("index", {
    tempDbName,
    queries: queries[tempDbName]
  });
});

const port = process.env.PORT || 3000;

app.listen({ port }, () => {
  console.log(`Ready at http://localhost:${port}`);
});
