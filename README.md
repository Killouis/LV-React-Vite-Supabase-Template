# LV React / Vite Template

## Steps

- npm create vite@latest my-app-template -- --template react-ts
- cd my-app-template
- pnpm install
- pnpm install @chakra-ui/react @emotion/react
- npx @chakra-ui/cli snippet add
- pnpm install -D vite-tsconfig-paths
- pnpm install @tanstack/react-query
- pnpm install @tanstack/react-router
- pnpm install -D @tanstack/router-plugin
- mkdir src/routes
- pnpm install react-i18next i18next i18next-http-backend i18next-browser-languagedetector
- pnpm install @supabase/supabase-js

## Supabase Admin User Role

```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"roles": ["admin"]}'::jsonb
WHERE id = 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX';
```

## .env.local

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=