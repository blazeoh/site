# Deploying to GitHub Pages

GitHub Pages is a free hosting service built into GitHub. It publishes your HTML, CSS, and JavaScript files directly from your repository as a live website.

This works for all three difficulty levels. MILD and HOT will work with no extra configuration. SPICY works with GitHub Pages as long as you are not running a custom backend server (see [SPICY.md](SPICY.md) for details).

---

## Steps

### 1. Make sure your code is in a public GitHub repository

Your repository must be **public** for GitHub Pages to work on a free account.

If it is currently private: go to **Settings > Danger Zone > Change repository visibility** and set it to Public.

### 2. Make sure `index.html` is in the right place

GitHub Pages looks for `index.html` in one of two places:

- The **root** of your repository (e.g., `index.html` at the top level)
- A folder named **`docs/`** at the root

If your `index.html` is inside a subfolder with a different name, GitHub Pages will not find it automatically. Move or copy it to the root, or rename the folder to `docs/`.

### 3. Enable GitHub Pages

1. Go to your repository on GitHub.
2. Click **Settings** (top navigation bar).
3. In the left sidebar, click **Pages**.
4. Under **Branch**, select `main` (or whichever branch has your code).
5. Under **folder**, select either `/ (root)` or `/docs` depending on where your `index.html` lives.
6. Click **Save**.

### 4. Wait for deployment

GitHub will build and deploy your site. This usually takes 1-2 minutes.

A banner at the top of the Pages settings will show your live URL once it is ready. It will look like:

```
https://your-username.github.io/your-repo-name/
```

### 5. Test your live site

Open the URL in a browser and confirm everything works. Check:

- All pages load (no 404 errors)
- CSS and JavaScript files load correctly
- Any API calls work (check the browser console for errors)

---

## Common Issues

**Site shows a 404:** GitHub Pages may still be building. Wait a minute and refresh. If it persists, confirm `index.html` is in the correct location and that the branch and folder settings are correct.

**CSS or JS not loading:** Check that file paths in your HTML use relative paths (e.g., `./style.css`, not `/style.css`). Absolute paths starting with `/` will break on GitHub Pages unless you configure a base URL.

**API calls failing:** If your API calls use `http://`, they may be blocked on the `https://` GitHub Pages domain. Make sure all API URLs use `https://`.

**Changes not showing up:** After pushing new commits, GitHub Pages redeploys automatically. It can take 1-2 minutes to update.

---

## Updating Your Site

Push any changes to the same branch you configured in step 3. GitHub Pages will redeploy automatically.

```bash
git add .
git commit -m "Update site"
git push
```
