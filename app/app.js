const express = require("express");
const app = express();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const connectDB = require("../config/connectDB");
const handleError = require("../controllers/errorController");
const Order = require("../models/Order");
const productRouter = require("../routes/productRouter");
const userRouter = require("../routes/userRouter");
const categoryRouter = require("../routes/categoryRouter");
const brandRouter = require("../routes/brandRouter");
const colorRouter = require("../routes/colorRouter");
const reviewRouter = require("../routes/reviewRouter");
const couponRouter = require("../routes/couponRouter");
const orderRouter = require("../routes/orderRouter");
const AppError = require("../utilities/AppError");
const morgan = require("morgan");
const cors=require('cors');
const api = process.env.API_URL;
app.use(cors())
connectDB();
app.use(morgan("tiny")); // to log all http requests coming from front end or postman

const endpointSecret =
  "whsec_54a5f5e8fd5bd31364f47212cbf6b9fa336d68f5e44f32e45e0d86a00d874ff3";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      // console.log(event)
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log(session);
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;

      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        {
          new: true,
        },
      );
      console.log(order);
    } else {
      return;
    }
    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     const paymentIntentSucceeded = event.data.object;
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  },
);
app.use(express.json()); // to parse incoming request and make them readable throw req.body

app.use(`${api}/users`, userRouter);
app.use(`${api}/product`, productRouter);
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/brand`, brandRouter);
app.use(`${api}/color`, colorRouter);
app.use(`${api}/reviews`, reviewRouter);
app.use(`${api}/order`, orderRouter);
app.use(`${api}/coupon`, couponRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on the server`, 404));
});

//stripe webhook
// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.

// This is your Stripe CLI webhook secret for testing your endpoint locally.

app.use(handleError);

module.exports = app;
