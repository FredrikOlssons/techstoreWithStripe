npm i stripe...

let stripe
stripe = Stripe('public key) 

secret key på serve
publishable key = på klienten


skicka in objekt
handleonetimepayment {
    proceedtoCheckout
line_items [
    {
        pric_data {
            currency: sek
            product_data: {
                description:, 
                name:
            }
            unit_amount: 12000
        }
        quantity: 2
    }
}
]
mode:


async function proceedtoCheckout(body) {

}

redirect to stripes checkout
const result = await stripe.redirecttocheckout


---> till succesUrl-sidan

verifyCheckoutSession()

function verifyCheckoutSession() {

}


titta på quickstart och guider om stripe

1. importera stripe klient och server
2. skapa objekt för att i sin tur skapa en session
3. server - skapa session
4. klient startar redirectToStripe
5. skapa succesURL
6. verifiera att betalningen är gjord
7. 


server.js

app.post..............{
    try{
        const session = await.stripe.checkout.sessions.session

    }}