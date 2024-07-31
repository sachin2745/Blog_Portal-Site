const { model, Schema } = require('../connection');

const commentSchema = new Schema(
  {
    name:{
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    postId: {
      type: String, 
         
    },
    userId: {
      type: String,     
    },
    likes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = model('Comment', commentSchema);
