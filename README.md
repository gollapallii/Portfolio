# Sadananda Reddy: Portfolio (React + Django)

React (Vite) frontend, Django JSON API backend. Content lives in `backend/api/data.py`.

## Run the backend (terminal 1)
    cd backend
    python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
    pip install -r requirements.txt
    python manage.py runserver

## Run the frontend (terminal 2)
    cd frontend
    npm install
    npm run dev

Open http://localhost:5173. Vite proxies `/api` to Django on port 8000.
Contact form messages are saved to `backend/messages.jsonl`.

## Endpoints
- `GET /api/portfolio/` returns all portfolio content
- `POST /api/contact/` accepts `{name, email, message}`
