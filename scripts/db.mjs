import EmbeddedPostgres from "embedded-postgres";
import path from "node:path";
import fs from "node:fs";

const databaseDir = path.resolve(process.cwd(), ".pgdata");

const pg = new EmbeddedPostgres({
  port: 5432,
  databaseDir,
  user: "masrouf",
  password: "masrouf_dev_password",
  persistent: true,
});

async function main() {
  const action = process.argv[2] || "start";

  if (action === "start") {
    if (!fs.existsSync(databaseDir)) {
      // eslint-disable-next-line no-console
      console.log("Initializing database directory...");
      await pg.initialise();
    }
    // eslint-disable-next-line no-console
    console.log("Starting PostgreSQL on port 5432...");
    await pg.start();
    try {
      await pg.createDatabase("masrouf_dev");
    } catch {
      // Already exists
    }
    // eslint-disable-next-line no-console
    console.log("PostgreSQL is ready!");
  } else if (action === "stop") {
    // eslint-disable-next-line no-console
    console.log("Stopping PostgreSQL...");
    await pg.stop();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Database manager error:", err);
  process.exit(1);
});
