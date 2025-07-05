import { Driver, getCredentialsFromEnv } from "ydb-sdk";

export default class DBClient {
  private _driver: Driver;
  private static instance: DBClient;

  constructor(driver: Driver) {
    this._driver = driver;
  }

  static async getInstance() {
    if (!DBClient.instance) {
      const authService = getCredentialsFromEnv();

      const endpoint = process.env.DB_ENDPOINT;
      const database = process.env.DB_NAME;
      if (!endpoint || !database) {
        throw new Error(
          "DB_ENDPOINT or DB_NAME environment variables are not set",
        );
      }
      const connectionString = `${endpoint}${database}`;

      const driver = new Driver({
        authService,
        connectionString,
      });

      const ready = await driver.ready(10000);

      if (!ready) throw new Error("YDB driver id not ready");

      DBClient.instance = new DBClient(driver);
    }

    return DBClient.instance;
  }

  get driver() {
    return this._driver;
  }
}
