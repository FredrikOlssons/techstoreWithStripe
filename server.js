require('dotenv').config();
constfs = require("fs")
const express = require('express')

//const secret = process.env.SUPER_SECRET_KEY
const stripe = require('stripe')(process.env.SUPER_SECRET_KEY);

// more imports here

/* if (process.env.NODE_ENV !== 'production') {
    require('dotenv')
}
 */


const PORT = 3003;
const YOUR_DOMAIN = 'http://localhost:3003';

const app = express()



app.use('/', express.static('./client'))
app.use(express.json())


app.set('view engine','ejs')

app.get('/client/assets',function(req,res) {

    fs.readFile('data.json',function(error,data) {
        
        if(error) {
            
            res.status(500).end()
            
        }else {
            res.send(JSON.parse(data))
            console.log(data)
      }
    })
  })


 /*  app.post("/api/session/new", async (req, res) => {

    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: req.body.line_items,
      mode: "payment",
      success_url: "http://localhost:3003/success.html",
      cancel_url: "http://localhost:3003/"   
    })
    console.log(session)
    res.status(200).json({ id: session.id})
}) */


  app.post("/create-checkout-session", async (req, res) => {
    
    let boughtItems = req.body;
    console.log(boughtItems, 'all items in cart')
    
    
    let itemsToPay = [];
    
    boughtItems.forEach((item) => {
        console.log(item, 'loop through items')
      let items = {
        price_data: {
          currency: "sek",
          product_data: {
            name: item.title,
            description: item.description,
           
           
          },
          unit_amount: item.price * 100
        },
        quantity: 1,

      };
      itemsToPay.push(items);
      console.log(items, 'items')
      console.log(itemsToPay, 'toStripe')
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: itemsToPay,
        
        mode: "payment",

        
        success_url: `http://localhost:3003/success.html`,
        cancel_url: "https://localhost:3003/cancel.html",
      });
      res.status(200).json({ id: session.id });
    });

  
 




app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`)

})