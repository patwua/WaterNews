# WaterNews

## Brand Tokens

Shared design tokens live in `frontend/lib/brand-tokens.ts`. Import these
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
[tsx](https://github.com/esbuild-kit/tsx). Run them from the project root, for
example:

```bash
npm run migrate-avatar-to-profilePhoto
```

Ensure required environment variables such as `MONGODB_URI` are set before
running a script.
