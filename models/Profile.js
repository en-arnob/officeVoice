// user, title, bio, profilepic, links, posts, bookmarks

const { Schema, model } = require("mongoose");
// const User = require("./User");
// const Post = require("./Post");

const profileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    profilePic: String,
    links: {
      website: String,
      facebook: String,
      linkedin: String,
      github: String,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Profile = model("Profile", profileSchema);
module.exports = "Profile";