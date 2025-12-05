document.addEventListener("DOMContentLoaded", async () => {
    const stripe = Stripe(window.STRIPE_PUBLISHABLE_KEY);

    const paymentRequest = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: { label: "Demo Item", amount: 1000 },
        requestPayerName: true,
        requestPayerEmail: true
    });

    const result = await paymentRequest.canMakePayment();
    if (!result || !result.applePay) {
        console.log("Apple Pay not available");
        return;
    }

    const customBtn = document.getElementById("applePayButton");

    customBtn.addEventListener("click", async () => {
        paymentRequest.show();
    });

    paymentRequest.on("paymentmethod", async (ev) => {

        const piRes = await fetch("/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 1000 })
        });

        const { clientSecret } = await piRes.json();

        const { error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: ev.paymentMethod.id
        }, { handleActions: false });

        if (error) {
            ev.complete("fail");
        } else {
            ev.complete("success");
        }
    });
});
