import { DataSource } from "typeorm";
import { config } from "dotenv";
import { Logger } from "@nestjs/common";

config();
const logger = new Logger("DataSource");
const isDevelopment = process.env.NODE_ENV === "development";

const dataSource = new DataSource({
  type: "postgres",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  entities: ["dist/modules/**/entities/*{.ts,.js}"],
  migrations: ["dist/migrations/**/*{.ts,.js}"],
  synchronize: isDevelopment,
  migrationsTableName: "migrations",
  ssl: process.env.DB_SSL === "true",
});

export async function initializeDataSource() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
    logger.log("Successfully initialized database connection");
  }
  return dataSource;
}

export default dataSource;