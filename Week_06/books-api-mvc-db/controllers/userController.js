const User = require("../models/user");

const createUser = async (req, res) => {
  const newUser = req.body;
  console.log(newUser);
  try {
    const createdUser = await User.createUser(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
}

const getAllUsers = async (req, res) => {
    try {
      const users = await User.getAllUsers();
      res.json(users);
    }
    catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving users");
    }
}

const getUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const user = await User.getUserById(id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving user");
    }
}

const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const updatedUser = req.body;
    try {
      const user = await User.updateUser(id, updatedUser);
      if (user) {
        res.json(user);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating user");
    }
}

const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const success = await User.deleteUser(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting user");
    }
}
async function searchUsers(req, res) {
    const searchTerm = req.query.searchTerm; // Extract search term from query params
  
    try {    
      const users = await User.searchUsers(searchTerm);
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error searching users" });
    }
  }

  async function getUsersWithBooks(req, res) {
    try {
      const users = await User.getUsersWithBooks();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching users with books" });
    }
  }
  

module.exports = {
    createUser, 
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers,
    getUsersWithBooks
};