const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please try a valid email'],
    },

    thoughts: [
        {
        type: Schema.Types.ObjectId,
        ref: 'thought',
      },
    ],

    friends: [
        {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  {
    toJSON: {
      virtual: true,
    },
    id: false,
  }
);

userSchema
  .virtual('friendCount')
  .get(function() {
  return this.friend.length;
});

const User = model('User', userSchema);

module.exportd = User;