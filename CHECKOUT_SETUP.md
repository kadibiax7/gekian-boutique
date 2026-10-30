# Stripe sandbox checkout

This branch adds test payments only. Live keys are rejected. It does not create fulfillment orders or reserve inventory; do not enable real payments until signed webhooks, durable orders, stock reservation, shipping, tax and return policies have been implemented and tested.

## Deployment prerequisites

1. Secret Manager in project `gekain` must contain `STRIPE_TEST_SECRET_KEY` (the owner reports this is created). No key value belongs in GitHub.
2. Grant this secret to backend `gekian-boutique` using an authenticated Firebase CLI:

   `firebase apphosting:secrets:grantaccess STRIPE_TEST_SECRET_KEY --backend gekian-boutique --project gekain`

3. Confirm the backend runtime service account has permission to read the Firestore products collection. The Admin SDK uses Application Default Credentials; no downloaded private key is needed.
4. The YAML maps the secret at runtime only. CHECKOUT_ORIGIN defaults to `https://gekian.com`; for local testing override it with the local server origin.
5. Product documents must be writable only by trusted administrators. Review deployed Firestore rules before enabling checkout: buyers must never be able to change price, stock or approval fields.

## Approved products

Existing products have no approved selling prices. Do not invent prices or copy supplier cost into checkout. In each approved product document, retain the existing `status: staged`, title and catalog data, and add a `checkout` map:

```json
{
  "enabled": true,
  "currency": "USD",
  "unitAmount": 2500,
  "stock": 5
}
```

These numbers are illustrative, not approved prices: `unitAmount` is integer cents ($25.00 in this example). Supported prices are $0.50–$500 per item and quantities 1–10 per line. Both the display and server charge use this explicit price. Products without approval remain blocked by the server.

For products with options, also add `checkout.variants`, e.g. `[{"color":"Red","size":"M","unitAmount":2500,"stock":3}]`. Values must exactly match the color/size sent by the product page. For this first version all option prices must match the base checkout unitAmount; unsupported options or different prices are rejected. Base stock, when configured, caps aggregate quantities across options.

## Verification

Run `npm test` and `npm run build`. After deployment, verify invalid bags are rejected, unapproved products are blocked, approved products redirect to Stripe sandbox, cancellation preserves the bag, and a completed test card payment is confirmed on the success page. The success page reads payment status from Stripe; visiting the URL alone cannot mark a payment successful. Test transactions never trigger shipment. An end-to-end test requires actual runtime access to the saved secret and approved catalog data.
