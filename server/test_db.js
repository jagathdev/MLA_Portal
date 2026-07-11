import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    city: { type: String },
    village: { type: String },
    ward: { type: String },
    role: { type: String, enum: ["citizen", "admin"], default: "citizen" },
});

const User = mongoose.model('User', UserSchema);

async function test() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB.");

        const indexes = await User.listIndexes();
        console.log("Indexes:", indexes);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
test();
