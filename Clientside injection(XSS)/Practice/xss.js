const express = require('express')
const app = express()
const port = 5000

app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send("<h1>Practice</h1>")
})
app.get('/xsspractice1', (req, res) =>{
    const name = req.query.name.replaceAll("<","").replaceAll(">","")
    const message=`
    <!DOCTYPE html>
<html lang="en">
<head>
    <title>XSS</title>
</head>
<body>
    <h1>${name}</h1>
</body>
</html>
    `
    res.send(message)
})
app.get('/xsspractice2', (req, res) =>{
    const url = req.query.url.replaceAll("<","").replaceAll('>',"").replaceAll('"',"")
    const message=`
    <!DOCTYPE html>
<html lang="en">
<head>
    <title>XSS</title>
</head>
<body>
    <a href="${url}" >click here</a>
</body>
</html>
    `
    res.send(message)
})
app.listen(port, () => console.log(`Example app listening at http://localhost:3000`))