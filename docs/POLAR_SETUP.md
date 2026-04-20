# Polar.sh Setup — KitPager

Manual checklist. The app expects 3 plans and a webhook.

## 1. Create org
1. Sign up at https://polar.sh as the org for KitPager.
2. Note the **organization ID**.

## 2. Create products

Free plan does not need a Polar product (no charge). Create two:

### Creator — $12/month, $120/year
- Product: **Creator**
- Description: "All templates, private rates, basic analytics, broken-link alerts."
- Recurring price 1: USD 12.00 / month → save **price ID**
- Recurring price 2: USD 120.00 / year → save **price ID**
- Trial: 7 days

### Pro — $29/month, $290/year
- Product: **Pro**
- Description: "Advanced analytics, viewed-by alerts, priority support."
- Recurring price 1: USD 29.00 / month → save **price ID**
- Recurring price 2: USD 290.00 / year → save **price ID**
- Trial: 7 days

## 3. Save IDs to DB

```sql
update public.plans set
  polar_product_id = '<creator product id>',
  polar_monthly_price_id = '<creator monthly price id>',
  polar_annual_price_id = '<creator annual price id>'
where tier = 'creator';

update public.plans set
  polar_product_id = '<pro product id>',
  polar_monthly_price_id = '<pro monthly price id>',
  polar_annual_price_id = '<pro annual price id>'
where tier = 'pro';
```

## 4. Webhook
- Polar dashboard → Settings → Webhooks → Add endpoint.
- URL: `https://kitpager.pro/api/webhooks/polar`
- Subscribed events:
  - `checkout.created`, `checkout.updated`
  - `subscription.created`, `subscription.active`, `subscription.canceled`, `subscription.revoked`, `subscription.updated`, `subscription.past_due`
  - `order.paid`, `order.refunded`
  - `customer.state_changed`
- Save the **webhook secret** → Vercel env `POLAR_WEBHOOK_SECRET`.

## 5. Access token
- Settings → API → Create org access token.
- Scopes: `products:read`, `subscriptions:read`, `subscriptions:write`, `customers:read`, `customers:write`, `checkouts:write`.
- Save → Vercel env `POLAR_ACCESS_TOKEN`.

## 6. Test (no real card)
- Create a 100% off forever discount code in Polar.
- Run through checkout with that code.
- Verify webhook received in `webhook_events` table.
- Verify `billing_subscriptions` row created with correct `plan_tier`.

## 7. Entitlement rule (server)
The entitlement check on every protected feature must compute:
```
1. admin_overrides (if active and effective_to > now) → use that tier
2. else billing_subscriptions (if active or trialing) → use that tier
3. else 'free'
```
**Never** trust the client. The plan tier comes from the DB on every request.
