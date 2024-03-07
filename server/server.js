const express = require("express");
const cors = require("cors");
const app = express();


require("dotenv").config();

const PORT = process.env.PORT||5000;
app.use(express.json());

// const corsOptions = {
//     Credentials:true,
//     origin:['http://localhost:5000/','http://localhost:3000/']
// }
app.use(cors());

const dbConnect = require("./config/database");
dbConnect();

const user=require("./routes/User");
app.use("/api/v1",user);

app.listen(PORT,()=>{
    console.log(`Server connected Successfully ${PORT}`);
})
app.get("/",(req,res)=>{
    res.send(`<h1> This is homepage guys</h1>`)
})