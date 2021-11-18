const express = require('express')
const path = require('path')
const cors = require('cors')
// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'a570b56a1b134b8cb6ae0793e1e9af87',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')



const app = express()

const students = ["Tanner"]

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
    rollbar.info("htm file served successfully")
})

app.get("/api/students", (req, res) => {
    res.status(200).send(students);
    rollbar.info("someone got the list of students on page load")
});

app.post("api/students", (req, res)=> {
    let {name} =req.body
    name = name.trim(); //get rid of white space
    const index = students.findIndex((studentName) => studentName === name);//find the index of the name, cycle through entire array, if name is in array  gives name else return -1

    if(index === -1 && name !== "") {
        students.push(name);
        rollbar.log("Student added succesfully", {author: "Tanner", type: "manual entry"}) //log what happened 
        res.status(200).send(students)
    } else if(name === "") {
        rollbar.error("No Name given")
        res.status(400).send("Must provide a name")
    
    }else {
        rollbar.error("Student already exists");
        res.status(400).send("That student already exists")
    }
})
app.use(rollbar.errorHandler());


const port = process.env.PORT || 4545;

app.listen(port, () => {
    console.log(`Your boy is on ${port}`)
})