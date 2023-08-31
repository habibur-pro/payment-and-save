require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



app.post('/payment', async (req, res) => {
    const { item } = req.body;
    console.log(req.body)
    const domainUrl = `${req.protocol}://${req.get('host')}`;



    const redirectURL =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'http://localhost:3000';

    const transformedItem = {
        price_data: {
            currency: 'usd',
            product_data: {
                images: [item.image],
                name: item.name,
            },
            unit_amount: item.price * 100,
        },
        quantity: item.quantity,
    };

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [transformedItem],
        mode: 'payment',
        // optional start 
        invoice_creation: {
            enabled: true,
            invoice_data: {
                description: `Invoice for ${item.name}`,
                metadata: {
                    order: 'order-xyz',
                },

                custom_fields: [
                    {
                        name: 'Purchase Order',
                        value: 'PO-XYZ',
                    },
                ],
                rendering_options: {
                    amount_tax_display: 'include_inclusive_tax',
                },
                footer: 'Dwelling',
            },
        },
        // optional end

        success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: redirectURL + '?status=cancel',
        metadata: {
            images: item.image,
        },
    });

    res.json({ id: session.id });
});

app.get('/success', async (req, res) => {
    const { session_id } = req.query;
    const sessionData = await stripe.checkout.sessions.retrieve(session_id);
    const customerData = await stripe.customers.retrieve(sessionData.customer);
    // console.log('session data', sessionData)
    // console.log('customer', customerData)

    


    await res.redirect('https://www.facebook.com/')

})



app.get('/', (req, res) => {

    res.send('running')
})

app.listen(port, () => {
    console.log('running')
})