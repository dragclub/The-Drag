import deals from "../models/deals.model.js"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

//request handler to create a deal
export const createDeal= async (req,res)=>{
const {name, description, creatorType, followers, mobile,  dealType,socialMedia}= req.body;

try{
if(!name || !description || !mobile || !socialMedia){
  console.log("error");
    return res.status(400).json({
        success:false,
        
        message:"Company Name, Deal description, Mobile and Social Media Link are required",
        
    })
}


let token;
if(req.cookies){
    if(req.cookies['accessToken']){
   const token=req.cookies['accessToken'];
  const dealData= jwt.verify(token,process.env.SECRET_KEY)
  console.log("dealdata",dealData)
  const brand = dealData.brand || false;
  if(dealData.brand){
      const obj = {
        companyName: name,
        dealDescription: description,
        creatorType,
        followers,
        dealType: [dealType],
        mobile: mobile,
        socialMedia,
        email: dealData.email,
      };

      const newDeal = await deals.create(obj);

      return res.status(200).json({
        success: true,
        message: "Your deal will be posted after approval within 24 hours ",
      });
  }
  else{
     return res.status(403).json({
       sucess: false,
       message: "Only Brand can Post Deal",
     });
  }

    }
    else{
        return res.status(400).json({
            sucess:false,
            message:"Please Login First"
        })
    }

}
else{
    return res.status(400).json({
        sucess:false,
        message:"Please Login First"
    })
}
}
catch(e){
    console.log(e);
return res.status(500).json({
    success:false,
    message:"Internal Server Error",
    
})
}
}


//request handler to delet a deal
export const deleteDeal=async (req,res)=>{

    const {email, id}= req.body;

  try{
    let token;
    if(req.cookies){
        if(req.cookies['accessToken']){
       const token=req.cookies.accessToken;
      const dealData= jwt.verify(token,process.env.SECRET_KEY);
      
      if(dealData.email===email){

      await deals.findByIdAndDelete(id);



        return res.status(200).json({
            success:true,
            message:"Deal deleted Successfully"
          })
      }
      else{
        return res.status(400).json({
            success:false,
            message:"You don't have permissions to delete this deal"
        })
      }
      
     
        }
        else{
            return res.status(400).json({
                sucess:false,
                message:"Please Login First"
            })
        }
    
    }
    else{
        return res.status(400).json({
            sucess:false,
            message:"Please Login First"
        })
    }
}
catch(e){
    return res.status(500).json({
        success:false,
        message:"Internal Server Error"
    })
}




}
export const getDeals = async (req, res) => {
  try {
    const { dealType, page = 1, limit = 10, companyName } = req.query;
    const query = { approved: "true" };
    

    // Add dealType filter if provided
    if (dealType) {
      query.dealType = { $in: [dealType] };
    }

    // Add companyName filter if provided, case-insensitive
    if (companyName) {
      query.companyName = { $regex: new RegExp(companyName, "i") };
    }

    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Fetch filtered and paginated deals
    const data = await deals.find(query).skip(skip).limit(parseInt(limit));

    // Count total documents for pagination info
    const totalDeals = await deals.countDocuments(query);

    return res.status(200).json({
      success: true,
      data,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalDeals / limit),
      totalDeals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching deals",
      error: error.message,
    });
  }
};


// export const getDeals = async (req, res) => {
//     try {
//         const { dealType, page = 1, limit = 10 } = req.query; // Default page 1, limit 10
//         const query = {};

//         // Add dealType filter if provided
//         if (dealType) {
//             query.dealType = { $in: [dealType] };
//         }
        
        

//         // Calculate pagination values
//         const skip = (page - 1) * limit;

//         // Fetch filtered and paginated deals
//         const data = await deals.find(query).skip(skip).limit(parseInt(limit));

//         // Count total documents for pagination info
//         const totalDeals = await deals.countDocuments(query);

//         return res.status(200).json({
//             success: true,
//             data,
//             currentPage: parseInt(page),
//             totalPages: Math.ceil(totalDeals / limit),
//             totalDeals
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Error fetching deals",
//             error: error.message
//         });
//     }
// };



