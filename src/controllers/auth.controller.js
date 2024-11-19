import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/user.model.js';


dotenv.config();

export const auth=async (req,res,next)=>{
        console.log(req.cookies)
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
export const isAdmin = (req, res, next) => {
  console.log("req", req.cookies);
  console.log("header", req.headers);
  const token =
    req.headers.authorization?.split(" ")[1] || req.cookies?.adminToken;
  console.log("tokenis",token)
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role === "admin") {
      req.admin = decoded;
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

