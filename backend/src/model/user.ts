import mongoose, { isValidObjectId } from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

let User = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    gender: {
        type: String
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String
    },
    creditCard: {
        type: String
    },
    profilePicture: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'waiter', 'guest'],
        default: 'guest'
    }
});

User.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password || '', 10, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

export default mongoose.model('User', User, 'users');
