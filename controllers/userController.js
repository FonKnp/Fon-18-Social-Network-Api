const User = require('../models/User');
const Thought = require('../models/Thought');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const userData = await User.find();
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Get user by Id
  async getUserById(req, res) {
    try {
      const userData = await User.findOne({ _id: params.userId });
      if (!userData) {
        return res.status(404).json({ message: 'No user found with this Id!' });
      }
      return res.json(userData);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // Create user
  async createUser({ body }, res) {
    try {
      const userData = await User.create(body);
      res.json(userData);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Update user
  async updateUser(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!userData) {
        return res.status(404).json({ message: 'No user found with thid Id!' });
      }
      res.json(userData);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Delete user
  async deleteUser(req, res) {
    try {
      const userData = await User.findOneAndDelete({ _id: params.userId });
      if (!userData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json({ message: "User deleted successfully!", userData });
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // add friend to a user
  async addFriend(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId }},
        { new: true }
      );
      if (!userData) {
        res.status(404).json({ message: 'No user found with thid Id!'});
        return;
      }
      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a friend from user
  async deleteFriend(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId }},
        { new: true }
      );
      if (!userData) {
        return res.status(404).json({ message: 'No user with this Id!' });
      }
      const deleted = userData.friends.indexOf(params.friendId) === -1;

      if (deleted) {
        res.json({ message: 'Successfully deleted friend!', userData });
      } else {
        res.json({ message: 'Cannot find friends or not deleted', userData });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
};