import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Fullname is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    otp: {
        type: String,    // Will be used for password reset
        default: null,
    },
    otpExpiry: {
        type: Date,      // Expiration time for the OTP
        default: null,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
