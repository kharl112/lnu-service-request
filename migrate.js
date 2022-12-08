const path = require("path");
const fs = require("fs");
const dbconnection = require("./src/db/connection");

const migrations_dir = path.join(__dirname, "src/db/migrations");
const files = fs.readdirSync(migrations_dir);

(async () => {
  //select only those with js ext
  files.filter((file) => file.endsWith(".js"));

  //connect to the database
  await dbconnection();

  await Promise.all(
    files.map(async (file) => {
      const migration_file_path = path.join(migrations_dir, file);
      const migration_file = require(migration_file_path);
      const { migrate } = await migration_file;
      //run migration
      try {
        await migrate();
        const log = file + ": Migrated - " + new Date().toLocaleString();
        console.log("\x1b[32m", log);
        console.log("\x1b[0m", "");
      } catch (error) {
        console.error("\x1b[31m", error);
        console.log("\x1b[0m", "");
        process.exit(0);
      }

      return 0;
    })
  );

  //end process
  process.exit(1);
})();
