import Creator from "../models/creator.model.js"
export const handlesearch = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const { search } = req.body;

  if (!search) {
    return res.status(200).json({ success: true, data: [] });
  }

  try {
   
    const query = {
      userName: { $regex: search, $options: "i" },
    };

    
    const creators = await Creator.aggregate([
      { $match: query },
      {
        $addFields: {
          socialMediaCount: {
            $sum: [
              "$socialMedia.insta.count",
              "$socialMedia.twitter.count",
              "$socialMedia.facebook.count",
              "$socialMedia.linkedin.count",
              "$socialMedia.youtube.count",
            ],
          },
        },
      },
      { $sort: { socialMediaCount: -1 } }, 
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

   
    const totalCreators = await Creator.countDocuments(query);
    const totalPages = Math.ceil(totalCreators / limit);

    return res.status(200).json({
      success: true,
      data: creators,
      totalCreators,
      totalPages,
      currentPage: page,
      pageSize: limit,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const filters = async (req, res) => {
    console.log('hiiiii');
    try {
      const { type, location, platform, count, sort } = req.body;
      let lb,ub;
      if(count){
      const arr = count.split('-');
      lb=Number(arr[0]);
       ub=Number(arr[1]);
      if (ub == 0) {
        ub = 100000000000;
      }
    }
    else{
      lb=0;
      ub=1000000000000000;
    }
  
  
      console.log(lb,ub,type,location, platform);
      const filter = {};
  
      // Add filters only if they are not empty and use $regex only when needed
      if (type && type !== "") {
        filter.type = { $regex: type, $options: 'i' }; // Case-insensitive regex
      }
      if (location && location !== "") {
        filter.location = { $regex: location, $options: 'i' }; // Case-insensitive regex
      }
      
     if(platform==="instagram"){
      filter["socialMedia.insta.count"]={$gte:lb,$lte:ub};
     }
     else if(platform==="linkedin"){
      filter["socialMedia.linkedin.count"]={$gte:lb,$lte:ub};
     }
     else if(platform==="twitter"){
      filter["socialMedia.twitter.count"]={$gte:lb,$lte:ub};
     }
     else if(platform==="facebook"){
      filter["socialMedia.facebook.count"]={$gte:lb,$lte:ub};
         }
     else if(platform==="youtube"){
      filter["socialMedia.youtube.count"]={$gte:lb,$lte:ub};
     }
    
        console.log(filter);
  
  
      const result= await Creator.find(filter).sort({count:sort==='asc'?1:-1});
  console.log(result);
      console.log('users',result.length);
  
      if(!result || result.length===0) return res.status(404).json({message:"No Creator found",result});
      return res.status(200).json({result});
    } catch (error) {
      console.log("Error",error);
      return res.status(500).json({message:"Internal server error"});
    }
  }

export const handleSearchAndFilter = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const { search, type, location, platform, count, sort } = req.body;
  console.log("req",req.body)
  console.log("search",search)
  
  const query = {};

 
  if (search) {
    query.userName = { $regex: search, $options: "i" }; 
  }

  if (type) {
    query.type = { $regex: type, $options: "i" }; 
  }
  if (location) {
    query.location = { $regex: location, $options: "i" }; 
  }

  
  let lb = 1,
    ub = Number.MAX_SAFE_INTEGER;
  if (count) {
    const [lower, upper] = count.split("-").map(Number);
    lb = lower || lb;
    ub = upper || ub;
  }

  
  if (platform) {
    const platformField = `socialMedia.${platform}.count`;
    query[platformField] = { $gte: lb, $lte: ub };
  }
  console.log("query1",query)
  try {
    
    const creators = await Creator.aggregate([
      { $match: query },
      {
        $addFields: {
           socialMediaCount: platform 
            ? `$socialMedia.${platform}.count`
            : {
                $sum: [
                  "$socialMedia.insta.count",
                  "$socialMedia.twitter.count",
                  "$socialMedia.facebook.count",
                  "$socialMedia.linkedin.count",
                  "$socialMedia.youtube.count",
                ],
              }
        },
      },
      { $sort: { socialMediaCount: sort === "asc" ? 1 : -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);
    //console.log("creator",creators)
    
    const totalCreators = await Creator.countDocuments(query);
    const totalPages = Math.ceil(totalCreators / limit);

    return res.status(200).json({
      success: true,
      data: creators,
      totalCreators,
      totalPages,
      currentPage: page,
      pageSize: limit,
    });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

