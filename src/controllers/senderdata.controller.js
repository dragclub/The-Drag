import fs from 'fs'
export const senderdata=(req,res,next)=>{
let str=fs.readFileSync("src/data.txt","utf-8");
let s=Number(str)+1;
      fs.writeFileSync("src/data.txt",s);



next();
}