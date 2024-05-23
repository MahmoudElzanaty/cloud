import mongoose from 'mongoose';

const PostsSchema = new mongoose.Schema({
    imageName: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const Posts = mongoose.model('Posts', PostsSchema);

export default Posts;
