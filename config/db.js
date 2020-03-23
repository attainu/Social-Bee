const mongoose= require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/Social-Bee",{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true
    })
.then(()=>console.log("MongoDB connected locally for testing Schemas"))
.catch((err)=>{
    console.log(err.message)
})

