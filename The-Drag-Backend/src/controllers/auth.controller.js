import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/user.model.js';


dotenv.config();

export const auth=async (req,res,next)=>{

      if(req.cookies?.accessToken){
              const token=req.cookies["accessToken"];
              const data=jwt.verify(token,process.env.SECRET_KEY);
                const user=await User.findOne({email:data.email});
                if(!user){
                    return res.status(403).json({
success:false,
message:"You are not Registered on our Website. Please Signup."

                    })
                }
                
next();
      }
      else{
        return res.status(403).json({
            success:false,
            message:" Please Login First."
        })
      }



}

