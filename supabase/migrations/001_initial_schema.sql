-- Categories (Pain, Viennoiserie, Pâtisserie, etc.)
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null default 0,
  image_url text,
  category_id uuid references categories(id) on delete set null,
  available_days text[] default '{}',
  is_available boolean default true,
  is_featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Collections (La semaine, Nos farines, etc.)
create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Junction table: collection <-> products
create table if not exists collection_products (
  collection_id uuid references collections(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  sort_order integer default 0,
  primary key (collection_id, product_id)
);

-- Orders (click & collect)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  pickup_date date not null,
  pickup_time time not null,
  items jsonb not null default '[]',
  total_amount numeric(10,2) not null default 0,
  status text not null default 'pending'
    check (status in ('pending','confirmed','ready','completed','cancelled')),
  notes text,
  created_at timestamptz default now()
);

-- RLS policies
alter table categories enable row level security;
alter table products enable row level security;
alter table collections enable row level security;
alter table collection_products enable row level security;
alter table orders enable row level security;

-- Public read access for products/categories/collections
create policy "Public read categories" on categories for select using (true);
create policy "Public read products" on products for select using (is_available = true);
create policy "Public read collections" on collections for select using (true);
create policy "Public read collection_products" on collection_products for select using (true);

-- Anyone can insert an order
create policy "Public insert orders" on orders for insert with check (true);

-- Only authenticated users (admin) can manage everything
create policy "Admin all categories" on categories for all using (auth.role() = 'authenticated');
create policy "Admin all products" on products for all using (auth.role() = 'authenticated');
create policy "Admin all collections" on collections for all using (auth.role() = 'authenticated');
create policy "Admin all collection_products" on collection_products for all using (auth.role() = 'authenticated');
create policy "Admin read orders" on orders for select using (auth.role() = 'authenticated');
create policy "Admin update orders" on orders for update using (auth.role() = 'authenticated');

-- Seed: default categories
insert into categories (name, slug, sort_order) values
  ('Pains', 'pains', 1),
  ('Viennoiseries', 'viennoiseries', 2),
  ('Pâtisseries', 'patisseries', 3),
  ('Biscuits', 'biscuits', 4),
  ('Farines', 'farines', 5)
on conflict (slug) do nothing;
