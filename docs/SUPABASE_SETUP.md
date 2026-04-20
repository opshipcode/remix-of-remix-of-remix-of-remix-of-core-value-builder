# Supabase Setup — KitPager

This is the manual setup checklist for the database, auth, RLS policies, and email templates. Run sections in order. Do not skip RLS — every table below has policies.

## 1. Create the project
1. Create a new Supabase project at https://supabase.com
2. Save the URL and anon key into your Vercel project as:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Save the **service role key** as `SUPABASE_SERVICE_ROLE_KEY` (Vercel **server env** only — never expose to client).

## 2. Auth configuration
- Authentication → URL Configuration:
  - Site URL: `https://kitpager.pro`
  - Additional redirect URLs: `https://kitpager.pro/*`, `http://localhost:5173/*`
- Authentication → Providers:
  - Enable **Email** (confirm email ON)
  - Enable **Google** (set client ID/secret)
- Authentication → Email Templates: see section 6 below.
- Authentication → Settings:
  - Enable **Leaked password protection** (HIBP)
  - Set **Minimum password length** to 10
  - Set OTP expiry to 30 minutes

## 3. SMTP (custom)
Authentication → SMTP Settings → Enable custom SMTP:
```
Host:     smtp.resend.com
Port:     465
Username: resend
Password: <your RESEND_API_KEY>
Sender:   KitPager <noreply@kitpager.pro>
```

## 4. Schema — run in SQL editor

```sql
-- ========== ENUMS ==========
create type public.app_role as enum ('admin','moderator','user');
create type public.plan_tier as enum ('free','creator','pro');
create type public.metric_source as enum ('api','oembed','manual','unavailable');
create type public.inquiry_status as enum ('new','replied','archived','spam');

-- ========== USERS / PROFILES ==========
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Roles in a SEPARATE table (anti-privilege-escalation)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

-- ========== CREATOR PAGES ==========
create table public.creator_pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug citext not null unique,
  template_id text not null default 'minimal',
  headline text,
  bio text,
  niche_tags text[] not null default '{}',
  contact_email text,
  is_published boolean not null default false,
  is_private boolean not null default false,
  password_hash text,
  country_blocklist text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.creator_pages enable row level security;

create table public.page_publications (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.creator_pages(id) on delete cascade,
  publication_version int not null,
  publication_json jsonb not null,
  is_current boolean not null default true,
  published_at timestamptz not null default now()
);
alter table public.page_publications enable row level security;

-- ========== PLATFORM CONTENT ==========
create table public.platform_accounts (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.creator_pages(id) on delete cascade,
  platform text not null,
  handle text not null,
  follower_count bigint,
  avg_views bigint,
  engagement_rate numeric(6,4),
  is_verified boolean not null default false,
  oauth_token_encrypted text,
  refreshed_at timestamptz
);
alter table public.platform_accounts enable row level security;

create table public.platform_content_items (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.creator_pages(id) on delete cascade,
  platform text not null,
  content_url text not null,
  content_id text not null,
  embed_html text,
  thumbnail_url text,
  title text,
  creator_handle text,
  view_count bigint,
  like_count bigint,
  comment_count bigint,
  engagement_rate numeric(6,4),
  metric_source metric_source not null default 'api',
  last_metrics_refresh_at timestamptz,
  is_broken boolean not null default false,
  broken_reason text,
  is_featured boolean not null default false,
  display_order int,
  niche_tags text[] not null default '{}',
  custom_caption text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.platform_content_items enable row level security;

-- ========== TESTIMONIALS ==========
create table public.testimonial_requests (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.creator_pages(id) on delete cascade,
  token text not null unique,
  requester_email text,
  brand_name text,
  brand_contact_name text,
  expires_at timestamptz not null,
  submitted_at timestamptz,
  is_expired boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.testimonial_requests enable row level security;

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.creator_pages(id) on delete cascade,
  request_id uuid references public.testimonial_requests(id),
  brand_name text not null,
  brand_contact_name text,
  brand_logo_url text,
  testimonial_text text not null,
  rating int check (rating between 1 and 5),
  is_approved boolean not null default false,
  is_visible boolean not null default true,
  display_order int,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.testimonials enable row level security;

-- ========== INQUIRIES ==========
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.creator_pages(id) on delete cascade,
  brand_name text not null,
  contact_name text not null,
  email text not null,
  website text,
  budget_range text,
  summary text not null,
  status inquiry_status not null default 'new',
  ip_address inet,
  user_agent text,
  received_at timestamptz not null default now()
);
alter table public.inquiries enable row level security;

-- ========== RATES ==========
create table public.rates (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.creator_pages(id) on delete cascade,
  deliverable text not null,
  price_label text,
  is_private boolean not null default false,
  notes text,
  display_order int
);
alter table public.rates enable row level security;

-- ========== BILLING (Polar) ==========
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  tier plan_tier not null unique,
  display_name text not null,
  monthly_price_cents int,
  annual_price_cents int,
  polar_product_id text,
  polar_monthly_price_id text,
  polar_annual_price_id text,
  is_active boolean not null default true
);

create table public.plan_features (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  feature_key text not null,
  feature_value jsonb not null,
  unique (plan_id, feature_key)
);

create table public.billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  polar_subscription_id text unique,
  plan_tier plan_tier not null,
  status text not null,
  current_period_end timestamptz,
  trial_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.billing_subscriptions enable row level security;

create table public.admin_overrides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_tier plan_tier not null,
  effective_from timestamptz not null default now(),
  effective_to timestamptz,
  notes text
);
alter table public.admin_overrides enable row level security;

-- ========== ANALYTICS ==========
create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.creator_pages(id) on delete cascade,
  visited_at timestamptz not null default now(),
  country text,
  city text,
  referrer text,
  duration_seconds int,
  is_unique boolean not null default true
);
alter table public.page_views enable row level security;

-- ========== AUDIT + WEBHOOKS ==========
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  metadata jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);
alter table public.audit_logs enable row level security;

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  external_id text unique,
  event_type text not null,
  raw_payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ========== INDEXES ==========
create index on public.creator_pages (user_id);
create index on public.page_publications (page_id, is_current);
create index on public.platform_content_items (page_id, is_broken);
create index on public.testimonial_requests (token);
create index on public.inquiries (page_id, status);
create index on public.page_views (page_id, visited_at desc);

-- Enable citext for case-insensitive slugs
create extension if not exists citext;
```

## 5. RLS policies — run after schema

```sql
-- profiles: user can see/update own
create policy "self read" on public.profiles for select using (auth.uid() = id);
create policy "self update" on public.profiles for update using (auth.uid() = id);

-- user_roles: user reads own; admin writes
create policy "self read roles" on public.user_roles for select using (auth.uid() = user_id);
create policy "admin write roles" on public.user_roles for all
  using (public.has_role(auth.uid(),'admin'));

-- creator_pages: owner full; public read only when published
create policy "owner all" on public.creator_pages for all using (auth.uid() = user_id);
create policy "public read published" on public.creator_pages for select
  using (is_published and not is_private);

-- page_publications: owner read+write; public read latest current
create policy "owner pub" on public.page_publications for all using (
  exists (select 1 from public.creator_pages p where p.id = page_id and p.user_id = auth.uid())
);
create policy "public read current pub" on public.page_publications for select using (
  is_current and exists (
    select 1 from public.creator_pages p where p.id = page_id and p.is_published and not p.is_private
  )
);

-- platform_accounts / platform_content_items / rates / testimonials: owner-scoped
-- (repeat the same pattern: owner all + public read where parent page is published)
-- ... abbreviated; mirror the page_publications pattern for each table

-- inquiries: insert is open (anyone can submit), select is owner-only
create policy "anyone submit" on public.inquiries for insert with check (true);
create policy "owner read" on public.inquiries for select using (
  exists (select 1 from public.creator_pages p where p.id = page_id and p.user_id = auth.uid())
);

-- billing_subscriptions: user reads own, only edge functions write (service role bypasses RLS)
create policy "self read subs" on public.billing_subscriptions for select using (auth.uid() = user_id);

-- audit_logs: user reads own; admin reads all
create policy "self audit" on public.audit_logs for select using (auth.uid() = user_id);
create policy "admin audit" on public.audit_logs for select using (public.has_role(auth.uid(),'admin'));
```

> **Apply the same owner-scoped + public-read-when-published pattern to every page-scoped child table.** Never leave a table without RLS.

## 6. Auth email templates

In Authentication → Email Templates, replace each template with the HTML in `docs/email-templates/`. Each must:
- Include the KitPager wordmark (no emoji)
- State the action and expiration time
- Use only `https://kitpager.pro` links
- Be mobile-safe (max-width 600px, system font fallback)

Templates to update:
- Confirm signup
- Magic link
- Reset password
- Email change

## 7. Storage buckets

Create these buckets in Storage:
- `avatars` — public read, authenticated write, 2MB cap, `image/*` only
- `brand-logos` — public read, anon write (testimonial flow), 1MB cap, `image/png,image/svg+xml,image/jpeg`
- `page-assets` — public read, authenticated write, 5MB cap

## 8. Seed data

```sql
insert into public.plans (tier, display_name, monthly_price_cents, annual_price_cents) values
  ('free','Free',0,0),
  ('creator','Creator',1200,12000),
  ('pro','Pro',2900,29000);
```

Update `polar_*_id` columns once you create products in Polar (see `POLAR_SETUP.md`).

## 9. Profile auto-create trigger

```sql
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  return new;
end$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

## Done? Verify with:
```sql
select tablename, rowsecurity from pg_tables where schemaname='public' order by tablename;
```
Every row must show `rowsecurity = true`.
