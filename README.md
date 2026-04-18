# Hirex — Events & Opportunities (UI Prototype)

Modern, responsive, UI-only prototype for **Hirex** (events and opportunities platform).

## How to run

- Open `index.html` in your browser (double-click it).

No backend, no build tools, and no installs are required.

## What’s included

- **Tabs**: Home, Hackathons, Workshops, Seminars, Opportunities  
- **Card-based listings**: rounded corners, soft shadows, hover effects, responsive grid
- **Details drawer** for every listing with:
  - **Register / Apply** flow (dummy forms)
  - **Paid flow** (consistent everywhere payments exist):
    - “Proceed to Payment”
    - Razorpay-style checkout (UI only)
    - After success: **Payment Successful**, **Registration Confirmed**, and
      “**A payment receipt has been sent to your registered email address**”
  - **Refund + cancellation terms**:
    - Refund allowed only until event start
    - After event starts → no refund
    - Organizer cancellations → full refund (simulated)
    - Cancellation status is clearly displayed
  - **Feedback & Reviews** section (scrollable cards)

## Notes

- All data is dummy and stored locally in your browser via `localStorage`.
- Use **“Reset demo data”** in the footer to clear registrations/applies/saves.

