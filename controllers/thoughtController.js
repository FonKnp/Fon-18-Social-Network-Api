const { Thought, User, Reaction } = require('../models');

module.exports = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get thought by ID
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });
      
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
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        {
          new: true,
        }
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
      const thoughtId = req.params.thoughtId;
      const reaction = req.body;

      // Assuming Thought is a Mongoose model
      const updatedThought = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          { $push: { reactions: reaction } },
          { new: true }
      );

      if (!updatedThought) {
          return res.status(404).json({ message: 'No thought found with this id!' });
      }

      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // // Update reaction
  // async updateReaction(req, res) {
  //   try {
  //     const thought = await Reaction.findOneAndUpdate(
  //       {
  //         _id: req.params.thoughtId,
  //         "reactions.reactionId": req.params.reactionId,
  //       },
  //       { $set: { "reactions.$.reactionBody": req.body.reactionBody } },
  //       { runValidators: true, new: true }
  //     );

  //     thought
  //       ? res.json(thought)
  //       : res.status(404).json({ message: "Reaction not found" });
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // },
  // Delete reaction
  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true } // Return the updated document
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought with this Id!' });
        }

        res.json(thought);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
  },
};