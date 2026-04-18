# Hirex — Events & Opportunities (Full frontend + backend)

Modern, responsive Hirex web app with:
- **Frontend**: `index.html`, `styles.css`, `app.js`
- **Backend API**: `api/index.py` (Flask)

The frontend is connected to the backend via `/api/*` endpoints for listing data, registration, apply, save, cancel, and reset.

## Run locally (recommended)

1. Open terminal in project root:
   - `c:\SHIVAM\Event and opportunity posting`
2. Install dependencies:
   - `pip install -r requirements.txt`
3. Start backend server:
   - `python api/index.py`
4. Open in browser:
   - [http://127.0.0.1:5000](http://127.0.0.1:5000)

## Backend endpoints

- `GET /api/health` → health check
- `GET /api/data` → listings data
- `GET /api/state` → current app state
- `POST /api/save` → save/unsave listing
- `POST /api/register` → register for events (paid/free simulation)
- `POST /api/apply` → apply to opportunities
- `POST /api/cancel` → cancel registration (user/organizer flow)
- `POST /api/reset` → reset saved state/registrations

## Persistence

- App state is now persisted in:
  - `data/state.json`
- This means registrations/saves survive server restarts.

## Deployment

- `vercel.json` rewrites `/api/*` to `api/index.py` for serverless deployment.
- Static frontend files are served from the project root.

