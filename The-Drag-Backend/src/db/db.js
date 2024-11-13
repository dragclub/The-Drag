import mongoose from 'mongoose';

const connectDB= async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log('Db connected successfull with host address', conn.connection.host);
    } catch (error) {
        console.error("Error occured while connected with database",error);
    }
}

export default connectDB;