# Naudic Business Pulse

A local-first business pacing dashboard for Naudic. It separates trading performance, cash movement and future commitments so inventory purchases do not distort monthly operating performance.

## Included

- Revenue, orders and marketing pacing against monthly targets
- Blended ROAS, MER, CPA and AOV
- Operating position waterfall
- Separate cash position and stock-purchase treatment
- People-cost register including on-costs
- Inventory value, COGS, stock on order and stock cover
- Flexible custom items with cash, operating and inventory impact preview
- Upcoming commitments
- Daily data entry
- JSON backup/restore and simple CSV transaction import
- Browser storage persistence

## Run locally

No build process or dependencies are required.

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## CSV import format

Use these headers:

```csv
date,name,amount,type,treatment
2026-09-14,Warehouse rebate,500,in,other_income
2026-09-14,Freelancer,800,out,one_off
```

Supported treatments are `operating_expense`, `one_off`, `inventory_purchase`, `staff`, `fulfilment`, `marketing`, `cogs`, `revenue`, `other_income`, `cash_only`, and `uncategorised`.

## Hosting

The app is a static site and can be hosted directly with GitHub Pages. It contains no API keys or server-side dependencies.

## Data note

The included figures are demonstration data only. Data is stored in the current browser using `localStorage`; use **Export JSON backup** before clearing browser data or moving devices.
