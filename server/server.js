const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());



// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '9652aa9180b049bf8a07db365de6f767',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

app.use(rollbar.errorHandler());

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

//Middleware
app.use(express.static(path.join(__dirname, "../public")));

// app.get("/", function(req, res) {
//     res.sendFile(path.join(__dirname, "../public/index.html"));
// });

// app.get("/styles", function(req, res) {
//     res.sendFile(path.join(__dirname, "../public/index.css"));
// })
const students = ['@gmail', '@yahoo', '@hotmail']

app.get('/', (req, res) => {
    rollbar.info("HTML serverd sucessfully");
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/students', (req, res) => {
    rollbar.info("Someone got the list of students to load");
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           rollbar.log("Email added successfully", {author: "Sam", type: "manual entry"});
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
           rollbar.error("No email provided");
           res.status(400).send('You must enter an email.')
       } else {
           rollbar.error("Email already exist");
           res.status(400).send('That Email already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    res.status(200).send(students)
})




try {
    nonExistentFunction();

} catch (error) {
    console.error(error);
    rollbar.error(error)
}


const port = process.env.PORT || 4105;

app.listen(port, () => {
    console.log(`We vibin on port ${port}`);
});