CREATE TABLE admins (
   admin_id bigserial PRiMARY KEY,
   admin_email text not null,
   admin_password text not null,
   admin_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
   id bigserial PRIMARY KEY,
   name text,
   phone_number text,
   code text,
   balance bigint DEFAULT 0,
   qrcode_image text,
   qrcode_image_url text,
   chat_id bigint,
   bot_lang text,
   bot_step text,
   created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE branches (
   id bigserial PRIMARY KEY,
   branch_id int,
   name_uz text,
   name_ru text,
   phone_number text [],
   schedule text,
   address_uz text,
   address_ru text,
   landmark_uz text,
   landmark_ru text,
   address_link text,
   image_url text,
   image_name text,
   latitude double precision,
   longitude double precision,
   created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE histories (
   id bigserial PRIMARY KEY,
   receipt_no bigint,
   type text,
   user_id bigint,
   branch int,
   date text,
   payments jsonb,
   amount bigint,
   items jsonb,
   created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE histories_bonus (
   id bigserial PRIMARY KEY,
   receipt_no bigint,
   user_id bigint,
   amount bigint,
   income boolean DEFAULT true,
   created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);