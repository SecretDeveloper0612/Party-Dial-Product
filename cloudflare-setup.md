# Cloudflare Setup Guide

This guide explains how to configure the Cloudflare dashboard manually for your PartyDial SaaS platform.

## 1. Domain & DNS
1. Add your domain to Cloudflare.
2. In the **DNS** section, ensure the records pointing to your Next.js and Express servers are marked with the orange cloud (**Proxied**).

## 2. SSL/TLS Settings
1. Go to **SSL/TLS > Overview**.
2. Select **Full (strict)**. (This requires a valid SSL certificate on your origin server).
3. Under **Edge Certificates**, enable **Always Use HTTPS** to automatically redirect HTTP traffic.

## 3. Caching Strategy
The code has been updated to provide correct cache headers. Cloudflare will respect these automatically:
- Static Next.js assets (`/_next/static/*`) will be cached for 1 year.
- API and dashboard routes will use `no-store` and bypass cache.

### Manual Cache Rules (Optional but Recommended)
Navigate to **Caching > Cache Rules** and create:
1. **Rule:** `Bypass Cache for API`
   - Expression: `(http.request.uri.path starts_with "/api/")` or `(http.request.uri.path starts_with "/admin/")`
   - Action: **Bypass cache**
2. **Rule:** `Cache Static Assets`
   - Expression: `(http.request.uri.path starts_with "/_next/static/")`
   - Action: **Eligible for cache**

## 4. Webhook Security
Razorpay webhooks must be allowed through Cloudflare's WAF.
1. Go to **Security > WAF > Custom rules**.
2. Create a rule named `Allow Razorpay Webhooks`.
3. Expression: `(http.request.uri.path contains "/api/webhooks")` (or your exact webhook route).
4. Action: **Skip** or **Allow** (bypassing WAF challenges and bot management).
