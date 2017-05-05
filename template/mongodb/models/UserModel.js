import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const { ObjectId } = Schema;

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    createDate: String, 
    modifyDate: String,
})

export default mongoose.model('User', UserSchema);