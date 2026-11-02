create extension if not exists "pgcrypto";

-- =========================================================
-- PROFILES / ROLES
-- =========================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer'
    check (role in ('customer','admin','staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- CATEGORIES
-- =========================================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,

  name_en text not null,
  name_ar text not null,
  slug text not null unique,

  description_en text,
  description_ar text,

  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- PRODUCTS
-- =========================================================

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,

  sku text unique,
  slug text not null unique,

  name_en text not null,
  name_ar text not null,

  description_en text,
  description_ar text,

  short_description_en text,
  short_description_ar text,

  product_type text not null default 'standard'
    check (product_type in ('standard','steel','quote_only')),

  status text not null default 'draft'
    check (status in ('draft','active','archived')),

  base_price numeric(14,2),
  compare_at_price numeric(14,2),

  currency text not null default 'SAR',

  tax_rate numeric(6,3) not null default 15,

  track_inventory boolean not null default true,
  allow_backorder boolean not null default false,

  featured boolean not null default false,

  meta_title_en text,
  meta_title_ar text,
  meta_description_en text,
  meta_description_ar text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- PRODUCT IMAGES
-- =========================================================

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,

  image_url text not null,
  alt_en text,
  alt_ar text,

  sort_order integer not null default 0,
  is_primary boolean not null default false,

  created_at timestamptz not null default now()
);

-- =========================================================
-- PRODUCT VARIANTS
-- =========================================================

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,

  sku text unique,

  grade text,
  size text,
  thickness text,
  length text,
  width text,
  weight_kg numeric(12,3),

  manufacturer text,
  origin_country text,
  finish text,

  price numeric(14,2),
  compare_at_price numeric(14,2),

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- INVENTORY
-- =========================================================

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null unique references public.product_variants(id) on delete cascade,

  quantity integer not null default 0,
  reserved_quantity integer not null default 0,
  low_stock_threshold integer not null default 5,

  updated_at timestamptz not null default now()
);

-- =========================================================
-- CUSTOMER ADDRESSES
-- =========================================================

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  label text,
  full_name text not null,
  phone text not null,

  country text not null default 'Saudi Arabia',
  city text not null,
  district text,
  street text,
  building text,
  postal_code text,

  is_default boolean not null default false,

  created_at timestamptz not null default now()
);

-- =========================================================
-- CARTS
-- =========================================================

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  session_id text,

  status text not null default 'active'
    check (status in ('active','converted','abandoned')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete cascade,

  quantity integer not null default 1 check (quantity > 0),

  created_at timestamptz not null default now(),

  unique(cart_id, variant_id)
);

-- =========================================================
-- COUPONS
-- =========================================================

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),

  code text not null unique,

  discount_type text not null
    check (discount_type in ('percent','fixed')),

  discount_value numeric(14,2) not null,

  minimum_order_amount numeric(14,2),
  maximum_discount_amount numeric(14,2),

  starts_at timestamptz,
  expires_at timestamptz,

  usage_limit integer,
  used_count integer not null default 0,

  is_active boolean not null default true,

  created_at timestamptz not null default now()
);

-- =========================================================
-- ORDERS
-- =========================================================

create sequence if not exists public.order_number_seq start 1001;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),

  order_number text not null unique
    default ('WX-' || nextval('public.order_number_seq')),

  user_id uuid references auth.users(id) on delete set null,

  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,

  shipping_address jsonb not null,

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'confirmed',
        'processing',
        'ready',
        'shipped',
        'delivered',
        'cancelled',
        'refunded'
      )
    ),

  payment_status text not null default 'unpaid'
    check (
      payment_status in (
        'unpaid',
        'pending',
        'paid',
        'failed',
        'refunded',
        'partially_refunded'
      )
    ),

  fulfillment_status text not null default 'unfulfilled'
    check (
      fulfillment_status in (
        'unfulfilled',
        'partial',
        'fulfilled'
      )
    ),

  subtotal numeric(14,2) not null default 0,
  discount_total numeric(14,2) not null default 0,
  shipping_total numeric(14,2) not null default 0,
  tax_total numeric(14,2) not null default 0,
  grand_total numeric(14,2) not null default 0,

  currency text not null default 'SAR',

  coupon_code text,

  customer_notes text,
  admin_notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- ORDER ITEMS
-- =========================================================

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,

  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,

  product_name_en text not null,
  product_name_ar text,

  sku text,

  variant_snapshot jsonb,

  quantity integer not null check (quantity > 0),

  unit_price numeric(14,2) not null,
  tax_rate numeric(6,3) not null default 15,
  tax_amount numeric(14,2) not null default 0,
  line_total numeric(14,2) not null,

  created_at timestamptz not null default now()
);

-- =========================================================
-- PAYMENTS
-- =========================================================

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,

  provider text not null default 'moyasar',

  provider_payment_id text unique,

  amount numeric(14,2) not null,
  currency text not null default 'SAR',

  status text not null default 'pending',

  payment_method text,

  provider_payload jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- SHIPMENTS
-- =========================================================

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,

  carrier text,
  tracking_number text,
  tracking_url text,

  status text not null default 'pending',

  shipped_at timestamptz,
  delivered_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- RFQ
-- =========================================================

create table if not exists public.rfqs (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references auth.users(id) on delete set null,

  customer_name text not null,
  customer_email text not null,
  customer_phone text,

  company text,

  status text not null default 'new'
    check (status in ('new','reviewing','quoted','accepted','rejected','closed')),

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rfq_items (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.rfqs(id) on delete cascade,

  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,

  quantity numeric(14,3) not null default 1,

  specifications jsonb,

  created_at timestamptz not null default now()
);

-- =========================================================
-- INDEXES
-- =========================================================

create index if not exists idx_products_category
  on public.products(category_id);

create index if not exists idx_products_status
  on public.products(status);

create index if not exists idx_variants_product
  on public.product_variants(product_id);

create index if not exists idx_orders_user
  on public.orders(user_id);

create index if not exists idx_orders_status
  on public.orders(status);

create index if not exists idx_orders_created_at
  on public.orders(created_at desc);

create index if not exists idx_addresses_user
  on public.addresses(user_id);

-- =========================================================
-- AUTO PROFILE AFTER SIGNUP
-- =========================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name',''),
    coalesce(new.raw_user_meta_data->>'phone','')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.rfqs enable row level security;
alter table public.rfq_items enable row level security;

-- Profiles
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

-- Addresses
create policy "Users manage own addresses"
on public.addresses
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Carts
create policy "Users manage own carts"
on public.carts
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage own cart items"
on public.cart_items
for all
using (
  exists (
    select 1
    from public.carts
    where carts.id = cart_items.cart_id
    and carts.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.carts
    where carts.id = cart_items.cart_id
    and carts.user_id = auth.uid()
  )
);

-- Orders
create policy "Users can view own orders"
on public.orders
for select
using (auth.uid() = user_id);

create policy "Users can view own order items"
on public.order_items
for select
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
    and orders.user_id = auth.uid()
  )
);

-- RFQ
create policy "Users can view own rfqs"
on public.rfqs
for select
using (auth.uid() = user_id);

create policy "Users can view own rfq items"
on public.rfq_items
for select
using (
  exists (
    select 1
    from public.rfqs
    where rfqs.id = rfq_items.rfq_id
    and rfqs.user_id = auth.uid()
  )
);

-- =========================================================
-- PUBLIC READ ACCESS FOR STORE
-- =========================================================

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory enable row level security;

create policy "Public can view active categories"
on public.categories
for select
using (is_active = true);

create policy "Public can view active products"
on public.products
for select
using (status = 'active');

create policy "Public can view product images"
on public.product_images
for select
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
    and products.status = 'active'
  )
);

create policy "Public can view active variants"
on public.product_variants
for select
using (
  is_active = true
  and exists (
    select 1
    from public.products
    where products.id = product_variants.product_id
    and products.status = 'active'
  )
);

create policy "Public can view inventory"
on public.inventory
for select
using (true);
