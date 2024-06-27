import mysql from 'mysql2'
import config from './config.js'
const { DB_HOST, DB_PASSWORD, DB_DATABASE, DB_USER } = config

const dbConnect = () => {
  const connection = mysql.createConnection({
    host     : DB_HOST,
    user     : DB_USER,
    password : DB_PASSWORD,
    database : DB_DATABASE
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      throw err;
    }

    console.log('🗂️  Database connected successfully!');
  });

  return connection;
};

export default dbConnect;