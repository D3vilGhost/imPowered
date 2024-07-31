import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    }

}, { timestamps: true });
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });
const Otp = mongoose.model('Otp', otpSchema);
export default Otp;