# Deployment notes

Read this before changing deploy settings, `.gitignore`, or `vercel.json`.

## The recipe data is not in git

`my-first-app/public/recipes.csv` (about 1.6 MB) is listed in `my-first-app/.gitignore` and is **not committed**. This is intentional: the owner decided the file is too big to store in git.

Because of this:

- Vercel builds from git, so a git-triggered deploy does **not** include `recipes.csv`. The live site then shows "Error loading recipes: Failed to load recipes.csv" and no ingredient suggestions.
- The live copy of the file comes from a deploy uploaded from the local folder with the Vercel CLI.

## How to deploy the data

After every push to `main`, redeploy from the local folder so the CSV is included:

```bash
cd my-first-app
vercel deploy --prod --yes
```

Then check that `https://pantry-panther.vercel.app/recipes.csv` returns 200 and is about 1.6 MB.

Do not commit `recipes.csv` to git unless the owner asks for it.

## Vercel config

- `vercel.json` at the repo root tells Vercel to install and build inside `my-first-app/`. The repo root has no `package.json`, so without this the build fails with `vite: command not found`.
- The Vercel project link is in `my-first-app/.vercel/project.json`.
