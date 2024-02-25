const express = require("express");
const app = express();
const { ObjectId } = require("mongodb");
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = "teamd65ca015f2541a";
const store_passwd = "teamd65ca015f2541a@ssl";
const is_live = false; //true for live, false for sandbox

const calculateAmount = (planName) => {
  let amount = 0;
  if (planName === "basic") {
    amount = 100 * 12;
  } else if (planName === "enterprise") {
    amount = 10 * 30;
  } else if (planName === "pro") {
    amount = 100 * 23;
  }
  return amount;
};




const sslcommarz = async (req, res, tasksCollection) => {
  try {
    const payInfo = req.body;
    // console.log(payInfo);

    const transId = new ObjectId().toString();
    const amount = calculateAmount(payInfo?.planName);

    // all for dynamic url
    const successUrl = `${req.protocol}://${req.get(
      "host"
    )}/payment/success/${transId}`;
    const failUrl = `${req.protocol}://${req.get(
      "host"
    )}/payment/failed/${transId}`;
    const cancelUrl = `${req.protocol}://${req.get("host")}/cancel`;
    const ipnUrl = `${req.protocol}://${req.get("host")}/ipn`;
    // all for daynamic url

    const data = {
      total_amount: amount,
      currency: payInfo?.currency,
      tran_id: transId, // use unique tran_id for each api call
      success_url: successUrl,
      fail_url: `http://localhost:5000/payment/failed/${transId}`,
      cancel_url: "http://localhost:3030/cancel",
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_name: "Computer.",
      product_category: "Electronic",
      product_profile: "general",
      cus_name: "Customer Name",
      cus_email: "customer@example.com",
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse) => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL;
      res.send({ url: GatewayPageURL });
      const finalPayment = {
        planName: payInfo?.planName,
        email: payInfo?.email,
        amount,
        paymentStatus: false,
        subscriptionStartDate: null,
        subscriptionEndDate: null,
        transactionId: transId,
      };
      // console.log(finalPayment);
      const result = tasksCollection.insertOne(finalPayment);

      console.log("Redirecting to: ", GatewayPageURL);
    });
  } catch (error) {
    console.log(error);
  }
};

const paymentSuccess = async (req, res, tasksCollection) => {
  try {
    const result = await tasksCollection.updateOne(
      { transactionId: req.params.transId },
      {
        $set: {
          paymentStatus: true,
        },
      }
    );
    if(result.modifiedCount > 0){
      // console.log('success ',app.settings.env);

            // const baseUrl =
            //   app.settings.env === "development"
            //     ? "http://localhost:3000"
            //     : "https://plan-pixel.vercel.app/"; // Replace 'https://your-production-url.com' with your actual production URL
            // res.redirect(`${baseUrl}/payment-success/${req.params.transId}`);
      res.redirect(
        `https://plan-pixel.vercel.app/payment-success/${req.params.transId}`
      );
    }
  } catch (error) {
    console.log(error);
  }
};
const paymentFailed = async (req, res, tasksCollection) => {

  try {
    const result = await tasksCollection.deleteOne(
      { transactionId: req.params.transId }
    );
    if(result.deletedCount){
            // const baseUrl =
            //   app.settings.env === "development"
            //     ? "http://localhost:3000"
            //     : "https://plan-pixel.vercel.app/"; // Replace 'https://your-production-url.com' with your actual production URL


            // res.redirect(`${baseUrl}/payment-failed`);
      res.redirect(
        `https://plan-pixel.vercel.app/payment-failed`
      );
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = { sslcommarz, paymentSuccess,paymentFailed };
