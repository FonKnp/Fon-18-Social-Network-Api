const { Thought, User } = require('../models');

module.exports = {
  // get all thoughts
  async getThought(req, res) {
    try {
      const thoughts = await Thought.find().populate('thoughts');
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get thought by ID
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .populate('thoughts');
      
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create a thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err)
    }
  },
  // Update thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought with this Id!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        res.status(404).json({ message: 'No thought with that Id!' });
      }
      
      await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId }}
      )
      res.json({ mesage: 'Thought have been deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create reaction
  async createReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body }},
        { new: true }
      )
      if (!thought) {
        res.status(404).json({ message: 'No thought with this Id!' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Delete reaction
  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId} }}
      )
      if (!thought) {
        res.status(404).json({ message: 'No thought with this Id!' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
};