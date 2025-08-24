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