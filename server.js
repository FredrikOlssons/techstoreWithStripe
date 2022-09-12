import express from 'express'
// more imports here 

const PORT = 3003; 
const app = express() 


app.use('/', express.static('./client'))






app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})