import Sequelize from "sequelize"
import User from "./user.js";
import config from "../config/config.js";
const env = 'development';
const db = {};

const sequelize = new Sequelize(config[env].database, config[env].username, config[env].password,config[env]);

db.sequelize = sequelize;
db.User = User;
User.initiate(sequelize);
User.associate(db);


export {sequelize};
export default db;