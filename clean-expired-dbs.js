import Neo4jTempDB from "neo4j-temp-db";
import neo4j from "neo4j-driver";

import dotenv from "dotenv";
dotenv.config();

const tempDb = new Neo4jTempDB(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USER,
    process.env.NEO4J_PASSWORD
  )
);

(async function() {
  await tempDb.cleanDatabasesOlderThan(60 * 20); // 20 minutes
  process.exit();
})();
