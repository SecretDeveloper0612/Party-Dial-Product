# Cloudflare Production Checklist

Before announcing the changes to your users, run through this verification checklist.

## 1. Network & Routing
- [ ] Check domain resolves to Cloudflare IPs (use `nslookup yourdomain.com`).
- [ ] Ensure "Full (strict)" SSL is active without any infinite redirect loops.
- [ ] Verify `http://` traffic correctly redirects to `https://`.

## 2. API & Caching
- [ ] Make a GET request to `/api/config` and verify the `Cache-Control: no-store` header is present.
- [ ] Make a request to a static asset (e.g., a Next.js JS file) and verify `Cache-Control: public, max-age=31536000` is present.
- [ ] Verify the `CF-Cache-Status` header shows `HIT` for static assets and `BYPASS` or `MISS` for API calls.

## 3. Security
- [ ] Check security headers (e.g., `X-Content-Type-Options: nosniff`) are returned on frontend pages.
- [ ] Verify that making >10 rapid requests to `/api/auth/` returns a `429 Too Many Requests` status code.
- [ ] Verify server logs accurately reflect your IP address, NOT Cloudflare's IP address.

## 4. Third-Party Integrations
- [ ] Test the **Razorpay** payment flow end-to-end to ensure the webhook successfully hits the backend.
- [ ] Test **Appwrite** authentication flows to ensure they are not blocked by the Next.js `X-Frame-Options` or CSP headers.
- [ ] Verify **PDF generation** works and can download successfully.
