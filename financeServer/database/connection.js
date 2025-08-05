const mongoose=require('mongoose')
mongoose.connect(process.env.BASE_URL,{
    useUnifiedTopology:true,
    useNewurlParser:true
}).then(()=>{
    console.log("____Mongoose connected successfully_______");
}).catch((err)=>{
    console.log("........Error in mongoose connection");
})