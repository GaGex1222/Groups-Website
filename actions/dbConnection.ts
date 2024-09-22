"use server";
import mysql from "mysql2/promise"

export default async function connectDb(){
    const dbConnection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'users',
        password: '1234',
        rowsAsArray: true
      });
    return dbConnection;
}