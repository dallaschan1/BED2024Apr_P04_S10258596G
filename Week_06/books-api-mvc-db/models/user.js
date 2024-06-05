// models/user.js

const sql = require("mssql");
const dbConfig = require("../dbConfig");
const e = require("express");

class User {
  constructor(id, username, email) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  static async createUser(newUser) {
    const connection = await sql.connect(dbConfig);

    // Check if the user already exists
    const checkQuery = `SELECT * FROM Users WHERE username = @username AND email = @email`;
    let request = connection.request();
    request.input("username", newUser.username);
    request.input("email", newUser.email);
    let result = await request.query(checkQuery);

    if (result.recordset.length > 0) {
      connection.close();
      throw new Error('User already exists');
    }

    console.log(newUser);
    // Insert the new user
    const insertQuery = `INSERT INTO Users (username, email) VALUES (@username, @email);
                         SELECT SCOPE_IDENTITY() AS id;`;

    request = connection.request();
    request.input("username", newUser.username);
    request.input("email", newUser.email);
    result = await request.query(insertQuery);

    connection.close();

    // Retrieve the newly created user using its ID
    return this.getUserById(result.recordset[0].id);
  }

  static async getAllUsers() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users`;

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new User(row.id, row.username, row.email)
    );
  }

  static async getUserById(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users WHERE id = @id`;

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new User(
          result.recordset[0].id,
          result.recordset[0].username,
          result.recordset[0].email
        )
      : null;
  }

  static async updateUser(id, updatedUser) {
    const connection = await sql.connect(dbConfig);

    // Check if the user exists
    const checkQuery = `SELECT * FROM Users WHERE id = @id`;
    let request = connection.request();
    request.input("id", id);
    let result = await request.query(checkQuery);

    if (result.recordset.length === 0) {
      connection.close();
      throw new Error('User not found');
    }

    const sqlQuery = `UPDATE Users SET username = @username, email = @email WHERE id = @id`;

    request = connection.request();
    request.input("id", id);
    request.input("username", updatedUser.username || null);
    request.input("email", updatedUser.email || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getUserById(id);
  }

  static async deleteUser(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Users WHERE id = @id`;

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    if (result.rowsAffected[0] === 0) {
      throw new Error('User not found');
    }
    else {
        return true;
    }
}

static async searchUsers(searchTerm) {
    const connection = await sql.connect(dbConfig);

    try{
    const sqlQuery = `SELECT * FROM Users WHERE username LIKE '%' + @searchTerm + '%' OR email LIKE '%' + @searchTerm + '%'`;

    const request = connection.request();
    request.input("searchTerm", searchTerm);
    const result = await request.query(sqlQuery);

    return result.recordset;
    }
    catch (error) {
        console.error(error);
        throw new Error('Error searching users');
    }
    finally {
    await connection.close();
    }
    
}

static async getUsersWithBooks() {
    const connection = await sql.connect(dbConfig);

    try {
      const query = `
        SELECT u.id AS user_id, u.username, u.email, b.id AS book_id, b.title, b.author
        FROM Users u
        LEFT JOIN UserBooks ub ON ub.user_id = u.id
        LEFT JOIN Books b ON ub.book_id = b.id
        ORDER BY u.username;
      `;

      const result = await connection.request().query(query);

      // Group users and their books
      const usersWithBooks = {};
      for (const row of result.recordset) {
        const userId = row.user_id;
        if (!usersWithBooks[userId]) {
          usersWithBooks[userId] = {
            id: userId,
            username: row.username,
            email: row.email,
            books: [],
          };
        }
        usersWithBooks[userId].books.push({
          id: row.book_id,
          title: row.title,
          author: row.author,
        });
      }

      return Object.values(usersWithBooks);
    } catch (error) {
      throw new Error("Error fetching users with books");
    } finally {
      await connection.close();
    }
  }

}   

module.exports = User;
