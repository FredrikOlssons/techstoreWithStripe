require('dotenv').config();
const fs = require("fs")
const express = require('express');
const { runInNewContext } = require('vm');

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

const checkCustomer = () => {
 

  
}


/* app.post('/check-if-customer-exists', async (req, res) => {
  let existingCustomers = await stripe.customers.list({email : req.body.email});
if(existingCustomers.data.length){
    console.log('this cus already exists bro')
}else{
    
      const customer = await stripe.customers.create({
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
       
      });
   
      addedcustomers.push(customer)
      console.log('customer created?');
      console.log(customer)
      res.json(customer.id)
}
}) */

app.post('/check-if-customer-exists', async (req, res) => {
  try {
    
const customers = await stripe.customers.list({
  email: req.body.email
}); 
console.log(customers)


let existingCustomer = customers.data.find((user) => {
  console.log(user.email, 'all the emails?')
  console.log(req.body.email, 'bod?')
  return user.email === req.body.email
  
  
})

if(!existingCustomer) {
  throw new Error("customer does not exist...")
}
console.log(existingCustomer, 'here')
res.status(200).json(existingCustomer)

  }catch(err) {
    console.log(err, 'no customer found')
    res.status(400).json(err)
  }
})



app.post('/create-customer', async (req, res) => {
  try {
    let existingCustomer = addedcustomers.find((user) => {
      console.log(user);
      if (user.email === req.body.email){
        console.log('user match')
        //return user.email == req.body.email

        // potentially save customer to json instead, to keep user outside of server-restart
      }
    })
    if(existingCustomer){
      return res.json('user exists')
  
    }

    const customer = await stripe.customers.create({
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
     
    });
 
    addedcustomers.push(customer)
    console.log('if not exists');
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

        success_url: `http://localhost:3000/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: "https://localhost:3000/cancel.html",
      });
      console.log(session)
      res.status(200).json(session.id);
    });

    let dateOrdered = new Date().toLocaleString();

    app.post("/confirm/:sessionId", async (req, res) => {
    
      const sessionId = req.params.sessionId;
      console.log(sessionId)
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        let orders = fs.readFileSync("orders.json");
        let orderData = JSON.parse(orders);

        let orderItem = orderData.find(order => order.sessionId === sessionId)
        if (!orderItem) {
          orderItem = {
              sessionId: session.id,
              customerName: session.customer_details.name,
              customerDetails: session.customer_details.email,
              total: session.amount_total,
              date: dateOrdered,
            
          };
          orderData.push(orderItem);
          fs.writeFileSync("orders.json", JSON.stringify(orderData));
        
    
        }
      } else {
        res.status(200).json(confirmedOrder = false);
      }
    
    });




    const endpointSecret = "whsec_e6bacd77318085612bc6145497a05f1147f690aed44be0efb52f76e87432831c";



app.post('/webhook', function(request, response) {
  const sig = request.headers['stripe-signature'];
  const body = request.body;

  let event = null;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    // invalid signature
    response.status(400).end();
    return;
  }

  let intent = null;
  switch (event['type']) {
    case 'payment_intent.succeeded':
      intent = event.data.object;
      console.log("Succeeded:", intent.id);
      break;
    case 'payment_intent.payment_failed':
      intent = event.data.object;
      const message = intent.last_payment_error && intent.last_payment_error.message;
      console.log('Failed:', intent.id, message);
      break;
  }

  response.sendStatus(200);
});
    




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})