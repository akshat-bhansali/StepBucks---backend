const mongoose = require("mongoose");

const contestSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
  },
  entryFee: {
    type: Number,
    required: [true, "Please Enter Entry Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  winType:{
    type:String,
  },
  entryType:{
    type:String,
  },
  images:
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    numOfWinners:{
        type:Number,
        required: true,
    },
  numOfParticipants: {
    type: Number,
    default: 0,
  },
  user: [{
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  multiplierStart: {
    type: Date
  },
  multiplierEnd: {
    type: Date
  },
});

module.exports = mongoose.model("Contest", contestSchema);