# ResumeForge — Full-stack Resume Builder

A polished resume builder built for a technical interview assignment. The UI collects candidate information and displays a real-time CV preview. **Save draft** calls a deliberate mock API (so the UI flow can be demonstrated without persistence); **Create CV** validates required data and saves it to PostgreSQL.

## Stack

- Frontend: React 18 + Vite + vanilla CSS
- Backend: Node.js + Express
- Database: PostgreSQL (`pg` driver)
- Deployment: Vercel (React) + Render (Express) + Render PostgreSQL

## Project map

```text
resume-forge/
├── client/                         # React / Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ResumeForm.jsx       # Candidate-information form
│   │   │   └── ResumePreview.jsx    # Live CV rendering
│   │   ├── services/api.js          # HTTP calls and API base URL
│   │   ├── App.jsx                  # Page state and action buttons
│   │   ├── main.jsx
│   │   └── styles.css               # Responsive visual design
│   └── package.json
├── server/                         # Express REST API
│   ├── src/
│   │   ├── controllers/resumeController.js # Endpoint behaviour
│   │   ├── routes/resumeRoutes.js           # Resume endpoints
│   │   ├── db/pool.js                        # PostgreSQL connection
│   │   ├── db/schema.sql                     # Database table
│   │   ├── middleware/errorHandler.js
│   │   ├── app.js                            # Express configuration
│   │   └── server.js                         # Server startup
│   ├── .env.example
│   └── package.json
├── vercel.json                     # Vercel SPA deployment settings
├── package.json                    # Run both applications together
└── README.md
```

## API contract

| Method | Endpoint | Purpose | Storage |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Health check for Render | None |
| `POST` | `/api/resumes/draft` | Save button’s dummy API response | None |
| `POST` | `/api/resumes` | Create CV button; validates `fullName`, `email` | PostgreSQL |
| `GET` | `/api/resumes/:id` | Fetch a saved CV | PostgreSQL |

The CV payload contains `fullName`, `email`, `phone`, `location`, `linkedin`, `summary`, experience, education, and comma-separated `skills`.

## Run it locally

### 1. Prerequisites

Install Node.js 20+ and PostgreSQL 15+ (or use a hosted PostgreSQL connection). Confirm they are available:

```bash
node --version
psql --version
```

### 2. Create the database

In PostgreSQL, run:

```sql
CREATE DATABASE resumeforge;
```

Then run the schema file against it (PowerShell):

```powershell
psql -U postgres -d resumeforge -f server/src/db/schema.sql
```

### 3. Add backend environment variables

Copy `server/.env.example` to `server/.env` and update the password in `DATABASE_URL`:

```env
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resumeforge
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Install and start

From the project root:

```bash
npm install
npm run install:all
npm run dev
```

Open `http://localhost:5173`. The Express health check is at `http://localhost:5001/api/health`.

## Deploy it

Push this folder to a new GitHub repository first. Do not commit `server/.env`.

### Database: Render PostgreSQL

1. In Render, select **New → PostgreSQL** and create a database.
2. Once ready, open its **Connect** panel and copy the **Internal Database URL** (best for a Render backend). Use the External URL only for a local client such as `psql`.
3. Run the contents of `server/src/db/schema.sql` using Render’s database connection/SQL console. This creates the `resumes` table.

### API: Render Web Service

1. Select **New → Web Service**, connect the GitHub repository, and use these values:

   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
2. Add environment variables:

   - `NODE_ENV=production`
   - `DATABASE_URL=<Render Internal Database URL>`
   - `CLIENT_URL=<your Vercel URL>` (add this after the frontend is deployed)
3. Deploy. Copy the generated API URL, for example `https://resume-forge-api.onrender.com`.
4. Verify `https://YOUR_API_URL/api/health` returns JSON.

### Frontend: Vercel

1. In Vercel, select **Add New → Project** and import the same GitHub repository.
2. Leave the root directory as the repository root—the included `vercel.json` builds `client` and serves its `dist` folder.
3. In **Environment Variables**, add:

   ```env
   VITE_API_URL=https://YOUR_API_URL/api
   ```

4. Deploy and copy the Vercel URL.
5. Return to Render, set `CLIENT_URL` to exactly that URL (for example `https://resume-forge.vercel.app`), and redeploy the API.

## Demo script for the interviewer

1. Fill in a name, email, professional summary, experience, and skills.
2. Point out that the CV preview updates immediately as the user types.
3. Click **Save draft**: it calls `POST /api/resumes/draft` and returns a dummy success response—ideal for demonstrating a lightweight temporary-save flow.
4. Click **Create CV**: this calls `POST /api/resumes`, validates name/email, and inserts the complete resume into PostgreSQL.
5. Show the created row in the Render database or query it with `SELECT * FROM resumes;`.

## Design and implementation choices

- The UI uses a warm editorial style with clear hierarchy so it feels intentional rather than template-like.
- Frontend state is controlled in `App.jsx`, allowing the form and preview to stay synchronised without a state library.
- The API separates routes, controllers, database configuration, and error handling—easy to extend with authentication, multiple resumes, PDF export, or user accounts.
- SQL uses parameterized values (`$1`, `$2`, …), protecting the insert from SQL injection.
