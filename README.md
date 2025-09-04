# WaterNews

## Brand Tokens

Shared design tokens live in `lib/brand-tokens.ts`. Import these
tokens instead of hard-coding values to keep the interface consistent.

```ts
import { colors } from "@/lib/brand-tokens";

<a
  style={{ "--brand": colors.primary }}
  className="text-[var(--brand)]"
>
  Link text
</a>
```

The file also exports fonts, spacing units, and logo paths for reuse across
components.

## Database Scripts

Scripts in the `scripts/` directory are written in TypeScript and executed with
[tsx](https://github.com/esbuild-kit/tsx). Run them from the project root, for example:

```bash
npm run migrate-avatar-to-profilePhoto
```

Ensure required environment variables such as `MONGODB_URI` are set before
running a script.

## Build and Start

Build the application using your preferred package manager:

- **pnpm**:

  ```bash
  corepack enable && pnpm install --frozen-lockfile && pnpm build
  ```

- **npm**:

  ```bash
  npm ci && npm run build
  ```

To run the server with database migrations applied:

- **pnpm**:

  ```bash
  pnpm prisma migrate deploy && pnpm start
  ```

- **npm**:

  ```bash
  npx prisma migrate deploy && npm start
  ```


## Routes
- `/news/[slug]` – canonical article view.
- `/article/[slug]` – legacy path now redirected to `/news/[slug]`.

## Environment Variables
- `PATWUA_FORWARD_URL`: optional URL to forward comments to Patwua.
- `PATWUA_API_KEY`: optional API key for Patwua requests.
- `PATWUA_CREATE_THREAD_URL`: optional endpoint to create Patwua discussion threads.
- `COMMENTS_DIGEST_TOKEN`: token required to trigger the comments digest job.

## Troubleshooting
- If `npm run typecheck` fails with “Cannot find type definition file for 'node'/'react'/'react-dom'`:
  - We intentionally rely on local `types/` and set "skipLibCheck": true.
    Ensure `tsconfig.json` has "typeRoots": ["./types", "./node_modules/@types"].
- If the registry returns 403 (e.g., fetching `cloudinary`):
  - `npm cache clean --force && npm config set registry https://registry.npmjs.org/`
  - Try pinning: `npm i cloudinary@1.41.1` (known-stable)
  - Typecheck will still pass due to dynamic require + ambient shims.
