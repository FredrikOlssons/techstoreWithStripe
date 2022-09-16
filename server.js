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





const PORT = 3000;
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



// const customer = await stripe.customers.retrieve(
//   'cus_MQjBZb981P4Rg6'
// );

let addedcustomers = []

app.post('/create-customer', async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone 
    });
    addedcustomers.push(customer)
    console.log(addedcustomers);
    res.json(customer.id)
  }catch (err){
    res.status(404).json(err)
  }
})


  app.post("/create-checkout-session", async (req, res) => {
    let boughtItems = req.body.cart;
    let itemsToPay = [];
    boughtItems.forEach((item) => {
      
      let items = {
        price_data: {
          currency: "sek",
          product_data: {
            name: item.title,
            description: item.description,

          },
          unit_amount: item.price * 100
        },
        quantity: 1, // kanske något annat här

      };
      itemsToPay.push(items);     
    });





    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],

        line_items: itemsToPay,
        customer: req.body.customerId,

        mode: "payment",
        submit_type: 'pay',

        success_url: `http://localhost:3000/success.html`,
        cancel_url: "https://localhost:3000/cancel.html",
      });
      console.log(session)
      res.status(200).json(session.id);
    });

    




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})