# Cloudflare WAF & Rate Limiting Rules

To maximize security while ensuring legitimate users (like partners, admins, and webhook services) can access the platform, configure the following rules in your Cloudflare Dashboard under **Security > WAF**.

## WAF Custom Rules

### 1. Block High-Risk Countries (Optional)
If your SaaS only operates in specific regions (e.g., India, US), consider blocking traffic from regions with high anomaly rates.
- **Expression:** `(ip.geoip.country in {"RU" "CN" "KP"})`
- **Action:** Block

### 2. Protect Admin & Vendor Panels
Challenge traffic hitting the admin panel to prevent brute forcing.
- **Expression:** `(http.request.uri.path starts_with "/admin/") or (http.request.uri.path starts_with "/vendor/")`
- **Action:** Managed Challenge

### 3. Allow Webhooks (CRITICAL)
Ensure third-party webhooks (e.g., Razorpay) bypass WAF challenges.
- **Expression:** `(http.request.uri.path contains "/api/webhooks")`
- **Action:** Skip (WAF Components: All)

## Rate Limiting Rules
*Note: Your Express backend now handles precise IP rate limiting, but edge rate limiting prevents DDoS.*

1. **Global API Limit:**
   - **Expression:** `(http.request.uri.path starts_with "/api/")`
   - **Rate:** 500 requests per 10 seconds per IP.
   - **Action:** Block

2. **Strict Auth/Login Limit:**
   - **Expression:** `(http.request.uri.path contains "/auth/") or (http.request.uri.path contains "/login/") or (http.request.uri.path contains "/otp/")`
   - **Rate:** 10 requests per 1 minute per IP.
   - **Action:** Block

## Bot Management
If you are on a Pro or Enterprise plan, enable **Bot Fight Mode**:
- Go to **Security > Bots**.
- Enable **Bot Fight Mode** to challenge automated scripts on signup/login flows.
