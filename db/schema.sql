CREATE SCHEMA IF NOT EXISTS devconnect;
SET search_path TO devconnect, public;


create table users(
    id uuid primary key default gen_random_uuid(),
    username text not null unique,
    password_hash text not null,
    email text not null unique,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table profiles(
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique references users(id) on delete cascade,
    headline text,
    bio text,
    avatar_url text,
    github_url text,
    skills text[] default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table posts(
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id) on delete cascade,
    title text not null,
    content text not null,
    code_snippet text ,
    code_language text,
    tags text[] default'{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table comments(
    id uuid primary key default gen_random_uuid(),
    post_id uuid not null references posts(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    content text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table likes(
    id uuid primary key default gen_random_uuid(),
    post_id uuid not null references posts(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    created_at timestamptz not null default now(),
    unique(post_id, user_id)
);

create table follows(
    id uuid primary key default gen_random_uuid(),
    follower_id uuid not null references users(id) on delete cascade,
    following_id uuid not null references users(id) on delete cascade,
    created_at timestamptz not null default now(),
    unique(follower_id, following_id),
    CHECK(follower_id != following_id)
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
