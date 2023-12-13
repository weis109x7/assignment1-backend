//import essentials
import mysql from 'mysql2';

//load config env
import dotenv from 'dotenv';
dotenv.config({path:'./config/config.env'})

//load variabes from config.env
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

//throw error if env not set
if (!dbHost||!dbPort||!dbUsername||!dbPassword||!dbName) {
    throw new Error('database environment variables must be set');
}

// create the connection to database
const connection = mysql.createPool({
    host: dbHost,
    port: dbPort,
    user: dbUsername,
    password: dbPassword,
    database: dbName
});

const connectionPool = connection.promise();

export default connectionPool;

