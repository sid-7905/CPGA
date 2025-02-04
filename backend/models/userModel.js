const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  image: {
    type: String,
    default: "default.jpg",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  platformIds: {
    type: Array,
    default: [],
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  problemTags: {
    type: Array,
    default: ["array", "math", "implementation"],
  },
  ratingRange: {
    min: {
      type: Number,
      default: 800,
    },
    max: {
      type: Number,
      default: 1800,
    },
  },
  dailyProblems: {
    type: [
      {
        status: {
          type: String,
          enum: ["pending", "solved"],
          default: "pending",
        },
        name: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        tags: {
          type: Array,
          default: [],
        },
        rating: {
          type: Number,
          required: true,
        },
        link: {
          type: String,
          required: true,
        },
        points : {
          type: Number,
          default: 0,
        },
      },
    ],
    default: [],
  },
  dailyPoints: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
