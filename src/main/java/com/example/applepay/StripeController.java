package com.example.applepay;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class StripeController {

    @PostMapping("/create-payment-intent")
    public Map<String, String> createPI(@RequestBody Map<String, Object> req) throws Exception {

        Stripe.apiKey = System.getenv("STRIPE_SECRET_KEY");

        long amount = Long.parseLong(req.get("amount").toString());

        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .setAmount(amount)
                        .setCurrency("usd")
                        .setAutomaticPaymentMethods(
                                PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                        .setEnabled(true)
                                        .build()
                        )
                        .build();

        PaymentIntent pi = PaymentIntent.create(params);

        return Collections.singletonMap("clientSecret", pi.getClientSecret());
    }
}
