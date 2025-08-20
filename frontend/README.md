# Frontend

## Troubleshooting
- If `npm run typecheck` fails with “Cannot find type definition file for 'node'/'react'/'react-dom'`:
  - We intentionally rely on local `types/` and set "skipLibCheck": true.
    Ensure `frontend/tsconfig.json` has "typeRoots": ["./types", "./node_modules/@types"].
- If the registry returns 403 (e.g., fetching `cloudinary`):
  - `npm cache clean --force && npm config set registry https://registry.npmjs.org/`
  - Try pinning: `npm i cloudinary@1.41.1` (known-stable)
  - Typecheck will still pass due to dynamic require + ambient shims.
