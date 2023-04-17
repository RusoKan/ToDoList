const express = require("express")
const BodyParser = require("body-parser")
const date=require(__dirname+"/date.js")
const app = express();
const mongoose=require("mongoose");
const { name } = require("ejs");
const _= require("lodash")
const day = date.getDate();

app.use(BodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.set("view engine", "ejs");

//app.set('case sensitive routing',true)
let items=[];
let workItems=[];
const uri="mongodb://127.0.0.1:27017/todoListDB"
const verification= async  () =>
{
  try {
    let res=await  mongoose.connect(uri)
    console.log("Succesfully logged")
   } catch (error) {
     console.log("Error",error)
   }
  }
  verification().then(()=>{
   const itemSchema=new mongoose.Schema(
   {
    Item:String
   }
   )
   const Items= mongoose.model('Item', itemSchema)

   //Items.
   
const listSchema=({
name:String,
items:[itemSchema]
})

const List=mongoose.model("List",listSchema)

 
 // mongoose.connection.close();
 const Drink= new Items({
  Item:"Welcome to your To do - List"
})
const Eat= new Items({
  Item:"To Add a New item, press the + button below"
})
const Sleep= new Items({
  Item:"<- - - - Use the checkbox to remove the item"
})
const Default=[Drink,Eat,Sleep]

   






app.get("/", (req, res) => {
  
        Items.find({}).exec()
          .then( (result)=> {
            items=result;
            if (result.length===0)
            {
              Items.insertMany(Default)
              .then(()=>
              {
              // console.log("Succesfully Inserted", items)
              res.redirect("/")
              })
              .catch((err)=>
                console.log(" Error", err)
              )
            }
            
            else{
            res.render('list.ejs', { listTitle:day ,  newchore:items , Route:req.url})
            }
            
          })
          .catch(err=>
          {
            console.log("error", err)
          })
          
         
  // console.log(items)
  
})
app.post("/",(req,res)=>{
  
  const NewList=req.body.newItem

  const newItems= new Items({
    Item:NewList

  })
  newItems.save();
    //items.push(newItem)
    
  res.redirect("/")

})



  // const NewList=req.params.NewList
  // const CreatedList= mongoose.model(NewList, itemSchema)
  // const newItem= new CreatedList({
  //   Item:req.body.newItem

  // })
  // newItem.save();
  // CreatedList.find({}).exec()

  // .then((result)=>{
      
  //    res.render('list', { listTitle: NewList,  newchore:result, Route:req.url})
  // })
  // .catch(err=>
  //   {
  //     console.log(err)
  //   }

  // )
  
  
//res.redirect("/"+NewList)
// })

app.get("/about", (req,res)=>
{
  res.render("about")
})

app.post("/delete",(req,res)=>
{console.log(req.body.checkbox)
  console.log("neing executed")
  const ListName=req.body.ListName
  const CheckedItem=req.body.checkbox
  console.log("The name is",req.body)
  if (ListName===day)
  {
    console.log("if executed")
   Items.findByIdAndDelete(CheckedItem).exec() 
    .then(()=>{
      console.log("removed ID")
      res.redirect("/")
    })
    .catch((err)=>{
      console.log("didnt work!",err)
    })
  
  
}
else{
  console.log("else")
  List.findOneAndUpdate({name:ListName}, {$pull:{items:{_id:CheckedItem}}})
  .then(()=>{
    console.log("removed ID")
    res.redirect("/"+ListName)
  })
  .catch((err)=>{
    console.log("didnt work!",err)
  })

}
})

app.listen("3000", () => {
  console.log(" My server is running")
})
app.get("/:NewList", (req,res)=>
{
  
  if (req.params.NewList === "favicon.ico") return;
  const NewList=_.capitalize(req.params.NewList)
 const list=new List({
  name:NewList,
  items:Default
 })
//  list.save()
 List.findOne({name:NewList}).exec()
 .then(result=>
  { 
    
    if(!result){
    //Create  a new list ( NO List found)
    
    // console.log("Hello",result)
      list.save().then(()=>
      {
        res.redirect("/"+NewList)
      })
      
    }
    else{
      // console.log("exist")
      res.render('list', { listTitle: result.name,  newchore:result.items, Route:req.url})
    }
  })
  .catch(err=>
    {
console.log (err)
    })
 
  
})

app.post("/:NewList", (req,res)=>
{
 const userInput=req.body.newItem
   const Param =_.capitalize(req.params.NewList)

   const customlist=new Items({
    Item:userInput
   })

   List.findOne({name:Param}).exec()
   .then( result=>
    {
      
      result.items.push(customlist)

      result.save().then(()=>{

        res.redirect("/"+Param)

      }

      )
      
      
      
    }

   )


})

})