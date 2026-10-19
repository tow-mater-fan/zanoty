# Zanoty website

Pages: index.html (Home), shop.html (Shop), checkout.html (Checkout), pages.html (The pages), faq.html (FAQ).

## 1. Put it on GitHub Pages
1. Create a new public repository on GitHub, for example `zanoty`.
2. Click "Add file" > "Upload files".
3. Drag in everything from this folder, including the `images` folder.
4. Click "Commit changes".
5. Go to Settings > Pages.
6. Set Source to "Deploy from a branch", pick `main` and `/ (root)`, then Save.
7. Wait 1 to 2 minutes. Your site is at `https://YOUR-USERNAME.github.io/zanoty/`.

## 2. Get orders by email (checkout page)
Customers pick Pay on delivery or Interac e-Transfer.
1. Open `main.js` and change `ORDER_EMAIL` to your real email.
2. Re-upload `main.js` to GitHub.
When someone places an order, their email app opens with the full order (name, address, phone, items, total, payment choice) addressed to you. They hit send and it lands in your inbox.

Shipping is set to $4.99, free over $35. Change `SHIPPING` and `FREE_SHIPPING_OVER` in `main.js`.

## 3. Turn on card payments (Stripe, later)
1. Sign in at dashboard.stripe.com.
2. Go to Product catalog > Add product. Make three products:
   - Zanoty Graph Notebook, $6.50
   - Zanoty Three Pack, $19.50
   - Zanoty Class Set of 30, $195.00
3. Go to Payment Links > New. Pick a product. Turn on "Let customers adjust quantity". Create the link.
4. Do this for all three products and copy each link.
5. Open `main.js`. At the top, paste each link between the quotes:
   - `one:` single notebook link
   - `three:` three pack link
   - `class:` class set link
6. Upload the new `main.js` to GitHub. The "Credit or debit card" option on the checkout page turns on by itself.

## 4. Check the sample info
These are sample details for now. Search the .html files and change them to your real info:
- Size: 8.5 × 11 in (Letter)
- Binding: Perfect bound, soft cover
- Paper: 100 gsm smooth white
- Shipping: ships in 2 business days, 3 to 7 day delivery, free over $35
- Returns: unused notebooks within 30 days
- Email: hello@zanoty.com
