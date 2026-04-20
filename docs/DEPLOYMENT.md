# Deployment — Vercel + Cloudflare + Email

Manual deployment checklist. Read end-to-end before starting.

## 1. Vercel project

1. Push repo to GitHub.
2. Import into Vercel. Framework preset: **Vite**.
3. Build command: `pnpm build`. Output: `dist`.
4. Set environment variables (next section).
5. Deploy preview, then promote to production.

## 2. Environment variables

### Public (frontend)
| Key | Value |
|---|---|
| `VITE_SUPABASE_URL` | from Supabase project settings |
| `VITE_SUPABASE_ANON_KEY` | from Supabase project settings |
| `VITE_TURNSTILE_SITE_KEY` | from Cloudflare Turnstile |
| `VITE_APP_URL` | `https://kitpager.pro` |
| `VITE_POLAR_PUBLIC_KEY` | from Polar dashboard |

### Server-only (Vercel functions)
| Key | Value |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | from Supabase, NEVER expose to client |
| `POLAR_ACCESS_TOKEN` | Polar org access token |
| `POLAR_WEBHOOK_SECRET` | from Polar webhook settings |
| `RESEND_API_KEY` | primary email provider |
| `SENDI_API_KEY` | failover email provider |
| `TURNSTILE_SECRET_KEY` | Cloudflare server-side validation key |
| `YOUTUBE_API_KEY` | YouTube Data API v3 |
| `INSTAGRAM_APP_SECRET` | Instagram Graph API |
| `TIKTOK_CLIENT_SECRET` | TikTok Display API (when approved) |
| `ADMIN_EMAIL_ALLOWLIST` | comma-separated admin emails |
| `UPSTASH_REDIS_REST_URL` | optional, rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | optional |

## 3. Custom domain

1. In Vercel → Domains, add `kitpager.pro` and `www.kitpager.pro`.
2. At your registrar, add the DNS records Vercel shows you.
3. Verify HTTPS is active.
4. Set Vercel project's primary domain to `kitpager.pro` (redirect www to apex).

## 4. Cloudflare in front of Vercel (recommended for 5–9k users)

Putting Cloudflare in front gives you DDoS protection, WAF, edge cache, geo headers, and Turnstile in one place.

### Setup
1. Move nameservers for `kitpager.pro` to Cloudflare.
2. Add a CNAME record `kitpager.pro` → `cname.vercel-dns.com` (proxied = orange cloud).
3. SSL/TLS mode → **Full (strict)**.
4. Speed → Auto Minify: HTML, CSS, JS.
5. Caching → Configuration → Browser cache TTL: Respect existing headers.
6. Rules → Page Rules:
   - `kitpager.pro/*` → Cache Level: Standard
   - Public kit pages (`/[slug]`) get `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400` from server.

### Geo headers
With Cloudflare proxied, edge functions read:
- `cf-ipcountry` — for country restriction enforcement
- `cf-ipcity` — for viewed-by city lookup
- `cf-connecting-ip` — real client IP for rate limiting

Use these headers in `/api/analytics/ingest` and country-block middleware.

## 5. Cloudflare Turnstile

1. Cloudflare dashboard → Turnstile → Add site.
2. Domain: `kitpager.pro`. Mode: **Managed**.
3. Save **Site key** → `VITE_TURNSTILE_SITE_KEY`.
4. Save **Secret key** → `TURNSTILE_SECRET_KEY` (server only).
5. Validate tokens server-side on every protected form:
   - `/api/inquiry/submit`
   - `/api/testimonials/submit/:token`
   - `/api/contact`
   - `/api/auth/signup` (skip for OAuth)

## 6. Email — Resend (primary) + Sendi (fallback)

### Resend
1. Sign up at https://resend.com.
2. Add domain `kitpager.pro`. Add the SPF, DKIM, DMARC DNS records they provide (in Cloudflare DNS).
3. Wait for verification (usually <30 min).
4. Create API key → `RESEND_API_KEY`.
5. Sender: `noreply@kitpager.pro`.

### Sendi (fallback)
1. Sign up. Add same domain. Verify with same DNS records (most providers share SPF/DKIM with delegation).
2. Create API key → `SENDI_API_KEY`.

### DNS records (in Cloudflare DNS, NOT proxied — DNS only)
```
TXT   @                    "v=spf1 include:_spf.resend.com include:_spf.sendi.io ~all"
TXT   resend._domainkey    <provided by Resend>
TXT   sendi._domainkey     <provided by Sendi>
TXT   _dmarc               "v=DMARC1; p=quarantine; rua=mailto:dmarc@kitpager.pro"
MX    @                    feedback-smtp.us-east-1.amazonses.com  10  (or per provider)
```

### Failover logic (already in spec)
The `/api/email/send` function tries Resend first; on `5xx` or timeout, retries with Sendi. Each provider gives 100/day free → 200/day combined free tier.

## 7. Admin protections

1. Set `ADMIN_EMAIL_ALLOWLIST=you@kitpager.pro,co@kitpager.pro`.
2. Admin route is at `/admin` — already excluded from `robots.txt`.
3. Admin middleware checks: authed AND email in allowlist AND has `admin` role row in `user_roles`.
4. Add yourself in SQL after first signup:
   ```sql
   insert into user_roles (user_id, role)
   values ((select id from auth.users where email='you@kitpager.pro'), 'admin');
   ```

## 8. Security headers (`vercel.json`)

```json
{
  "headers": [{
    "source": "/(.*)",
    "headers": [
      { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
      { "key": "Content-Security-Policy", "value": "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com https://www.youtube.com https://www.tiktok.com https://www.instagram.com; connect-src 'self' https://*.supabase.co https://api.polar.sh;" }
    ]
  }]
}
```

## 9. Scale tuning for 5–9k users

- Supabase: start on **Pro tier** ($25/mo). Compute size **Small** is enough for this load.
- Add `UPSTASH_REDIS_REST_*` and use Upstash for rate limits + slug uniqueness checks.
- Public `/:slug` pages: serve compiled JSON snapshot from `page_publications` and cache 5 min at Cloudflare edge.
- Add `pg_cron` for daily metric refresh and broken-link scan.
- Move analytics ingest to Edge Function with batched insert (every 60s) to avoid write amplification.

## 10. Final pre-launch checklist

- [ ] All Supabase tables show `rowsecurity = true`
- [ ] HTTPS active on apex + www
- [ ] All env vars set in Vercel for both Preview and Production
- [ ] Resend domain verified
- [ ] Sendi domain verified
- [ ] Turnstile site + secret set
- [ ] Polar products created and IDs in DB (see `POLAR_SETUP.md`)
- [ ] Admin user has `user_roles` row
- [ ] `robots.txt` excludes `/admin` and `/api`
- [ ] Sitemap published at `/sitemap.xml`
- [ ] OG image set
- [ ] Status page live at `/status`
- [ ] Test signup → onboarding → publish → public page → inquiry → email delivery end-to-end
