# Expense Tracker (React + Vite)

A personal finance app: expenses and income, per-category monthly budgets, multiple accounts,
recurring reminders, reports with charts and CSV export, 11 colour themes, and an admin module.
All data lives in the browser's Local Storage.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages (https://priiyanshu-kumar.github.io/expense-tracker/)

1. Replace the contents of your `expense-tracker` repo with these files (keep the repo name, because
   `vite.config.js` uses `base: '/expense-tracker/'`).
2. In the repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes the site.

The app uses hash routing (`/#/login`), so page refreshes work on GitHub Pages.

## Demo admin login

`admin@expense.com` / `admin123` (change it in `src/store.js`).

## Note on security

Accounts and passwords are stored in the browser's Local Storage in plain text. That is fine for a
demo or personal project but is not real authentication.
