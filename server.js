require('dotenv').config();
constfs = require("fs")
const express = require('express')

// more imports here

/* if (process.env.NODE_ENV !== 'production') {
    require('dotenv')
}
 */


const PORT = 3003;
const YOUR_DOMAIN = 'http://localhost:3003';

const app = express()
const secret = process.env.SUPER_SECRET_KEY
console.log(secret)


app.use('/', express.static('./client'))


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

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: '{{PRICE_ID}}',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });
  
    res.redirect(303, session.url);
  });





app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`)

})