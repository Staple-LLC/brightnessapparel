# Brightness Apparel — Git-backed CMS content

The homepage hero and contact page read `src/cms/website-content.json` directly. This is a normal Git-tracked file. The JSX layout, styles, image assets, shaders and navigation remain in the existing source. Other website sections are not yet CMS editable.

## How updates work

Client → CMS drafts → Publish → Java commits this JSON file → Vercel builds the commit → CMS confirms the production deployment.

`npm run build` validates the local content file before building. It performs no CMS fetch and requires no CMS build credentials. Editing, cloning or rebuilding this repository works without the CMS service being available. `npm run dev` also validates the file before starting Vite; changes to the JSON module then use Vite's normal reload behavior.

The local TypeScript package at `packages/cms-client` provides format/site/section validation. Node 24 is pinned for the existing TypeScript stripping scripts.

## Initial release setup

1. Review and push the source integration once. Include `src/cms/website-content.json`, its renderer, validation scripts, and the local package. Keep Vercel's normal `npm run build` command.
2. Remove obsolete `STAPLE_API_URL`, `STAPLE_WEBSITE_ID`, and `STAPLE_BUILD_KEY` build variables from Vercel if you previously added them. They are no longer used.
3. Install the Staple GitHub App on this repository and configure the Java publishing worker with its server-side credentials and Vercel read access. No server secrets belong in this website repository.
4. In CMS Administration, connect owner `joelchiang2k`, repository `brightnessapparel`, production branch `main`, managed path `src/cms/website-content.json`, the App installation ID, and the Vercel project/team IDs.
5. The remote content must match the current CMS drafts or a previously captured CMS version when first connecting. Reconcile differences deliberately; the connector will not overwrite unexpected content.
6. Publish a reviewed client edit. Confirm GitHub changes only this file and Vercel deploys the reported commit. The CMS shows Published only after production verification.

## Client record

- Website UUID: `82a18e9e-ea66-4834-8b4d-a7625eb59bef`
- Owner login: `brightnessapparel@staplesoftware.com`
- Imported sections: `/` → `hero`; `/contact` → `contact`
- Entitlement: existing 30-day development trial, no payment collected

The initial tracked file uses the original content imported into snapshot version 1. It is not proof that this new integration is deployed. No GitHub push or live deployment was performed while implementing the Git-backed change.

## Checks

```sh
npm run build
npm run test:cms
```

Drafts remain private in Supabase. A failed publication does not move the CMS's confirmed live pointer. GitHub may contain an attempted release that Vercel failed to deploy; the CMS distinguishes that failure from a successful publication. Developer edits to the managed file cause a conflict until reviewed and reconciled. Component/design changes still use the normal developer workflow.

See the backend `docs/git-publishing.md` for credential setup, worker recovery and permissions.
