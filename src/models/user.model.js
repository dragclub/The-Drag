import mongoose, {Schema} from 'mongoose';

const userSchema = new Schema({

    name:{
        type:String,
        required:true,
        trim:true 
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required: true,
        trim:true
    },
    brand:{
        type:Boolean,
        default:false
    }

});

const User = mongoose.model('User',userSchema);

export default User;