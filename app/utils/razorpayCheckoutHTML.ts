export const getRazorpayHTML = (
  orderId: string,
  key: string,
  amount: number,
  user: {
    name?: string;
    email?: string;
    phone?: string;
  } = {}
) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Processing Payment</title>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      <style>
        body {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          font-family: sans-serif;
          color: white;
          background: linear-gradient(to right, hsla(20, 100%, 22%, 1), hsla(19, 100%, 56%, 1));
        }
      </style>
    </head>
    <body>
      <div>Processing payment...</div>
      <script>
        const options = {
          key: "${key}",
          amount: "${amount}",
          currency: "INR",
          name: "Magic Tree",
          description: "Order Payment",
          order_id: "${orderId}",
          prefill: {
            name: "${user?.name || "Customer"}",
            email: "${user?.email || "customer@example.com"}",
            contact: "${user?.phone || ""}"
          },
          theme: {
            color: "hsla(151, 93%, 22%, 1)"
          },
          handler: function (response) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }));
          },
          modal: {
            ondismiss: function () {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                cancelled: true
              }));
            }
          }
        };

        // Wait for 200ms before opening to ensure full render
        setTimeout(() => {
          const rzp = new Razorpay(options);
          rzp.open();
        }, 200);
      </script>
    </body>
  </html>
`;
