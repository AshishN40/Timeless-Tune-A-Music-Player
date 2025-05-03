import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    plainPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    playlists: {
      type: Map,
      of: [String],
      default: new Map(),
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", schema);