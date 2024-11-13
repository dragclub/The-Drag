import mongoose,{Schema} from 'mongoose';

const creatorSchema=new Schema({
    name:{
      type:String,
      required:true,
    },
      userName:{
        type:String,
        required:true,
        unique:true
      },
      email:{
        type:String,
        required:true,
      },
      type:{
        type:String,
        required:true,
      },
      socialMedia:{
          insta:{
            url:String,
            count:{
              type:Number,
              
            }
          
          },

          twitter:{
            url:String,
            count:{
              type:Number,
              
            }
          },
          facebook:{
            url:String,
            count:{
              type:Number,
             
            }
          },
          linkedin:{
            url:String,
            count:{
              type:Number,
             
            }
          },
          youtube:{
            url:String,
            count:{
              type:Number,
             
            }
        }
      },
      Mobile_No:{
        type:String,
      },
      image:{
        type:String
      },
      location:{
        type:String,
        required:true
      },
      mainPlatform:{
        type:[],
      },
      count:{
        type:Number,
        default:0
      },
      approved:{
        type:String,
        default:'pending'
      }
      // location:{
      //   type:String,
      //   required:true

        
      // }

},{timestamps:true});

const Creator=mongoose.model("creator",creatorSchema);
export default Creator;

