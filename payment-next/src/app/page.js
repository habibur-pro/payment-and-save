"use client"
import React, { useState } from 'react';
import styles from './page.module.css'
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';


const Home = () => {
  const [item, setItem] = useState({
    name: 'Apple AirPods',
    description: 'Latest Apple AirPods.',
    image:
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    quantity: 0,
    price: 999,
  });

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = loadStripe(publishableKey);

  const createCheckOutSession = async () => {
    const stripe = await stripePromise;
    const checkoutSession = await axios.post('http://localhost:5000/payment', {
      item: item,
    });

    // await console.log(checkoutSession.data)


    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    alert(result)


    if (result.error) {
      alert(result.error.message);
    }
  };







  const changeQuantity = (value) => {
    // Don't allow the quantity less than 0, if the quantity is greater than value entered by user then the user entered quantity is used, else 0
    setItem({ ...item, quantity: Math.max(0, value) });
  };

  const onQuantityPlus = () => {
    changeQuantity(item.quantity + 1);
  };

  const onQuantityMinus = () => {
    changeQuantity(item.quantity - 1);
  };



  const onInputChange = (e) => {
    changeQuantity(parseInt(e.target.value));
  };

  return (
    <div className={styles.container}>
      <main>
        <div className='shadow-lg border rounded p-2 '>
          <Image src={item.image} width={300} height={150} alt={item.name} />
          <h2 className='text-2xl'>$ {item.price}</h2>
          <h3 className='text-xl'>{item.name}</h3>
          <p className='text-gray-500'>{item.description}</p>
          <p className='text-sm text-gray-600 mt-1'>Quantity:</p>
          <div className='border rounded'>
            <button
              onClick={onQuantityMinus}
              className='bg-blue-500 py-2 px-4 text-white rounded hover:bg-blue-600'
            >
              -
            </button>
            <input
              type='number'
              className='p-2'
              onChange={onInputChange}
              defaultValue={item.quantity}
            />
            <button
              onClick={onQuantityPlus}
              className='bg-blue-500 py-2 px-4 text-white rounded hover:bg-blue-600'
            >
              +
            </button>
          </div>
          <p>Total: ${item.quantity * item.price}</p>
          <button
            onClick={createCheckOutSession}
            disabled={item.quantity === 0}
            className='bg-blue-500 hover:bg-blue-600 text-white block w-full py-2 rounded mt-2 disabled:cursor-not-allowed disabled:bg-blue-100'
          >
            Buy
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;