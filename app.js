const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const UserR=require('./Routes/UserR')
const Signinroutes=require('./Routes/Signinroutes')
const AddTask=require('./Routes/AddTask')
const TaskGroup=require('./Routes/Tasks')
const TGroupR = require('./Routes/TGroupR')
const app = express();
const PORT=5000;
mongoose.connect('mongodb+srv://sachin:Project@cluster0.wxz5dsc.mongodb.net/?retryWrites=true&w=majority')
.then(()=> console.log("connected successfuly"))
.catch(err=> console.error("field connection",err));
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true}))
app.use('/api',UserR);
app.use('/api',Signinroutes);
app.use('/api',AddTask);
app.use('/api',TaskGroup);
app.use('/api',TGroupR);

app.listen(PORT,()=>{
    console.log(`server is runinng on http://localhost:${PORT}`)
})  
module.exports=app;