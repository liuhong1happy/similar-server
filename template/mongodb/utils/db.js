import mongoose from 'mongoose';

export default {
    init: ()=>{
        mongoose.connect('mongodb://root:123456@localhost/admin');
        mongoose.Promise = global.Promise;
    }
}