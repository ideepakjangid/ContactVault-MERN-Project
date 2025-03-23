require('dotenv').config('.env')
const express = require('express')
const mongoose = require('mongoose')
const ContactRoute = require('./routes/contact.route.js')
const UserRouter = require('./routes/user.route.js')
const cors = require('cors')
const path = require("path");
const app = express();
app.use(cors({origin:ACCESS_URL}))
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "dist")));
const PORT = process.env.PORT || 4000

app.use('/api/contact',ContactRoute)
app.use('/api/user',UserRouter)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });

mongoose.connect(process.env.MONGO_URL,{dbName:"contact_management"}).then(
    ()=>{
        console.log("DB connected...")
        app.listen(PORT,()=>{
            console.log("Server started and running on 5000")
        })
    }
).catch(
    (err)=>{
        console.log(err.message)
    }
)
