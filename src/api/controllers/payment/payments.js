// // This file is about creating task in the database
// const stripe = require("stripe")(`${process.env.STRIPE_SECRET_KEY}`);

// const PaymentIntend = async (req, res) => {
//   try {
//     const { packageCost } = req.body;
//     console.log(packageCost);
//     const amount = parseInt(packageCost * 100);
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount,
//       currency: "usd",
//       payment_method_types: ["card"],
//     });

//     // console.log(paymentIntent);
//     res.send({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.log(error);
//   }
// };

// module.exports = {
// PaymentIntend,
// };

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
  let amount = 0;
  if (planName === "basic") {
    amount = 12;
  } else if (planName === "enterprise") {
    amount = 30;
  } else if (planName === "pro") {
    amount = 23;
  }
  return amount;
};

const PaymentIntend = async (req, res) => {
  const { plan } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(plan),
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    // automatic_payment_methods: {
    //   enabled: true,
    // },
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

module.exports = {
  PaymentIntend,
};
