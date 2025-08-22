# Frontend

## Environment Variables
- `PATWUA_FORWARD_URL`: optional URL to forward comments to Patwua.
- `PATWUA_API_KEY`: optional API key for Patwua requests.
- `PATWUA_CREATE_THREAD_URL`: optional endpoint to create Patwua discussion threads.
- `COMMENTS_DIGEST_TOKEN`: token required to trigger the comments digest job.


## Troubleshooting
- If `npm run typecheck` fails with “Cannot find type definition file for 'node'/'react'/'react-dom'`:
  - We intentionally rely on local `types/` and set "skipLibCheck": true.
    Ensure `frontend/tsconfig.json` has "typeRoots": ["./types", "./node_modules/@types"].
- If the registry returns 403 (e.g., fetching `cloudinary`):
  - `npm cache clean --force && npm config set registry https://registry.npmjs.org/`
  - Try pinning: `npm i cloudinary@1.41.1` (known-stable)
  - Typecheck will still pass due to dynamic require + ambient shims.
