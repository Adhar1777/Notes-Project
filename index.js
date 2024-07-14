const express = require('express');
const path = require('path')
const app = express();
const fs = require('fs');
const { isUtf8 } = require('buffer');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine', 'ejs');

app.get("/",(req,res)=>{
    fs.readdir(`./files`,(err,files)=>{
        res.render("index",{files:files})
    })
})

app.post("/save",(req,res)=>{
    fs.writeFile(`./files/${req.body.Title.split(' ').join('')}.txt`, req.body.Details, (err)=>{

        res.redirect("/")
    });
})
app.post("/append/:TaskTitle",(req,res)=>{
    fs.appendFile(`./files/${req.body.Title.split(' ').join('')}.txt`,req.body.Details, (err)=>{
        res.redirect(`/Delete/${req.params.TaskTitle}`)
    });
})
app.get("/More/:TaskTitle",(req,res)=>{
    fs.readFile(`./files/${req.params.TaskTitle}`,"utf8" , (err,filedata)=>{
        res.render("More",{TaskTitle:req.params.TaskTitle.split('.'),
                            filedata:filedata
        })
    })
})

app.get("/Delete/:TaskTitle",(req,res)=>{
    fs.unlink(`./files/${req.params.TaskTitle}`,(err)=>{
        if(err){
            res.send(err.message);
        }
        res.redirect("/");
    })
})

app.get("/Edit/:TaskTitle",(req,res)=>{ 
    fs.readFile(`./files/${req.params.TaskTitle}`,"utf8" , (err,filedata)=>{
        res.render("Edit",{TaskTitle:req.params.TaskTitle,
                            filedata:filedata
        })
    })
})
app.listen(3000,()=>{
    console.log("Hey Its Working")
});
