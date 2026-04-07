# SoCal EBUS Prep Supabase setup

This app now supports:

- invited learner login with Supabase Auth
- first-password setup after invite acceptance
- required pretest gating before other modules unlock
- persistent learner snapshots, pretest attempts, lecture completion, and module time tracking

## 1. Apply the schema

Run the SQL in [`schema.sql`](/home/rjm/projects/EBUS_course/supabase/schema.sql) inside your Supabase SQL editor.

## 2. Configure the web app

Add the client variables from [`apps/web/.env.example`](/home/rjm/projects/EBUS_course/apps/web/.env.example):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SITE_URL`

The web app also accepts `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SUPABASE_PROJECT_REF` if you already have those in your environment.

## 3. Invite learners

Create a text file with one email per line, then run:

```bash
cd /home/rjm/projects/EBUS_course/apps/web
SUPABASE_URL="https://YOUR_PROJECT.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY" \
INVITE_REDIRECT_TO="https://your-app-host/auth" \
npm run invite:learners -- --emails ./learners.txt
```

The script also accepts `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_PROJECT_REF` as fallbacks for the project URL. It uses the admin API to send Supabase invite emails and seeds a `learner_profiles` row with `must_set_password = true`.

## 4. Hosting notes

- In Supabase Auth settings, add your production app URL and local dev URL to the redirect allow-list.
- SMTP must be configured in Supabase if you want branded invite emails.
- The service-role key is only for the invite script. Do not expose it in the Vite client environment.
