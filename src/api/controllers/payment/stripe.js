
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
  let amount = 0;
  if (items === "basic") {
    amount = 100 * 12;
  } else if (items === "enterprise") {
    amount = 10 * 30;
  } else if (items === "pro") {
    amount = 100 * 23;
  }
  return amount;
};

const PaymentIntend = async (req, res) => {
  const { plan } = req.body;

  // Create a PaymentIntent with the order amount and currency
  if(!plan){
    return 

  }
  console.log(plan);
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
