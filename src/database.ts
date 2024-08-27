import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
    host: 'localhost',
    dialect: "sqlite",
    storage: './tmp/app.db',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  });