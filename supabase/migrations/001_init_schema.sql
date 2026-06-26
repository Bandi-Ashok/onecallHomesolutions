-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text unique not null,
  email text,
  role text not null check (role in ('customer', 'partner', 'admin')),
  profile_image text,
  is_verified boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Services table
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  price decimal(10, 2) not null,
  image_url text,
  is_active boolean default true,
  estimated_time integer not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Bookings table
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  partner_id uuid references public.profiles(id),
  service_id uuid not null references public.services(id),
  address text not null,
  scheduled_time timestamp with time zone not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'refunded')),
  total_amount decimal(10, 2) not null,
  payment_method text check (payment_method in ('upi', 'card', 'netbanking', 'emi', 'cod')),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Reviews table
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- AMC Plans table
create table public.amc_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null check (name in ('Silver', 'Gold', 'Platinum', 'Corporate')),
  description text,
  price decimal(10, 2) not null,
  benefits jsonb,
  validity_days integer not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- AMC Subscriptions table
create table public.amc_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  plan_id uuid not null references public.amc_plans(id),
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  status text not null default 'active' check (status in ('active', 'expired')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Notifications table
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  title text not null,
  message text not null,
  read boolean default false,
  type text check (type in ('booking', 'payment', 'promotion', 'emergency')),
  created_at timestamp with time zone default now()
);

-- Emergency Requests table
create table public.emergency_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  booking_id uuid references public.bookings(id),
  address text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'assigned', 'resolved')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for performance
create index idx_bookings_customer_id on public.bookings(customer_id);
create index idx_bookings_partner_id on public.bookings(partner_id);
create index idx_bookings_service_id on public.bookings(service_id);
create index idx_bookings_status on public.bookings(status);
create index idx_reviews_booking_id on public.reviews(booking_id);
create index idx_amc_subscriptions_user_id on public.amc_subscriptions(user_id);
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_emergency_requests_user_id on public.emergency_requests(user_id);

-- Row Level Security (RLS) Policies

-- Profiles RLS
alter table public.profiles enable row level security;

create policy "Users can read their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can read all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Services RLS
alter table public.services enable row level security;

create policy "Anyone can read services" on public.services
  for select using (true);

create policy "Admins can create/update/delete services" on public.services
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Bookings RLS
alter table public.bookings enable row level security;

create policy "Customers can read their own bookings" on public.bookings
  for select using (auth.uid() = customer_id);

create policy "Partners can read assigned bookings" on public.bookings
  for select using (auth.uid() = partner_id);

create policy "Customers can create bookings" on public.bookings
  for insert with check (auth.uid() = customer_id);

create policy "Admins can read all bookings" on public.bookings
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Reviews RLS
alter table public.reviews enable row level security;

create policy "Anyone can read reviews" on public.reviews
  for select using (true);

create policy "Customers can create reviews for completed bookings" on public.reviews
  for insert with check (
    exists (
      select 1 from public.bookings
      where id = booking_id
      and customer_id = auth.uid()
      and status = 'completed'
    )
  );

-- Notifications RLS
alter table public.notifications enable row level security;

create policy "Users can read their own notifications" on public.notifications
  for select using (auth.uid() = user_id);

-- Emergency Requests RLS
alter table public.emergency_requests enable row level security;

create policy "Users can create their own emergency requests" on public.emergency_requests
  for insert with check (auth.uid() = user_id);

create policy "Partners and admins can read emergency requests" on public.emergency_requests
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('partner', 'admin')
    )
  );
