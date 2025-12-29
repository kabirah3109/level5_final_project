# Level 5 DSA Projects

A collection of static JavaScript demos for Map, Queue, and Stack.

## Projects

- Contact Manager — `Map/` (contact manager using `Map`)
- Task Scheduler — `Queue/` (FIFO queue simulator)
- Undo/Redo — `Stack/` (undo/redo using two stacks)

## Deploying (one link)

You can publish the entire folder as a single URL using GitHub Pages. I added a GitHub Actions workflow that automatically deploys the repository root to the `gh-pages` branch whenever you push to `main`.

Steps to deploy:

1. Create a GitHub repo and push your code (replace `<repo>` and `<your-username>`):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

2. After pushing, the workflow will build a `gh-pages` branch and publish the site. The site URL will be:

```
https://<your-username>.github.io/<repo>/
```

3. If you prefer to enable Pages manually, go to your repository Settings → Pages and select the `gh-pages` branch (root) as the source.

If you want a custom domain, add a `CNAME` file to the repo root and configure DNS.

If you'd like, I can also:

- Switch the workflow trigger to a different branch (e.g., `main` → `master`).
- Add a small `404.html` or index improvements.
    ├── script.js

