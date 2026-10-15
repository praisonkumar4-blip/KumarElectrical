# Kumar Electrical Contractor — Frontend

Responsive multi-page portal using HTML5, CSS3 and vanilla JavaScript. The original navy/yellow design, transitions, dark theme, worksite gallery, employee attendance portal and animated API loading overlay are retained.

## Connect to the Spring Boot backend
1. Start the Maven backend in the separate backend ZIP.
2. Start a static web server from this folder: `python -m http.server 5500`.
3. Open `http://localhost:5500`.
4. `api.js` defaults to `API_CONFIG = { baseUrl: 'http://localhost:8080/api', mode: 'backend' }`. Change `baseUrl` when deploying.
5. Sign in. The login request obtains a bearer token; API requests include it automatically.
6. While an API request is pending, the animated loading overlay remains visible. It hides on success or error. Admin changes are saved to `/api/state` and employee pages load the filtered state from the server.

## Development accounts only
- Admin: `ADMIN` / `admin123`
- Employees: `EMP001`, `EMP002`, `EMP003` / `emp123`
Set stronger environment-based credentials in the backend before use beyond local development.

## Pages
`index.html`, `login.html`, `admin.html`, `employee.html`, `sites.html`, `attendance.html`, `my-dashboard.html`, `salary.html`, `gallery.html`, `reports.html`, `style.css`, `app.js`, `api.js`.

## Important architecture notes
- Frontend records are cached in browser localStorage for rendering, but admin mutations are also synchronized to the backend after initial state load. MySQL is the shared source for cross-device use.
- Employees can read only their filtered state through the backend; only admins can save the shared state.
- The backend starter persists the current UI state as a JSON document in MySQL to preserve compatibility with all current pages. See the backend README for limitations and production migration guidance.
- Attendance is manually entered by the admin. Salary is an estimate based on the current demo rules; validate payroll rules server-side before real use.
- No fingerprint functionality is faked. Browser/native biometrics need a separate WebAuthn/native integration.
- The public landing page uses its local sample/project content; the logged-in admin and employee portal uses backend data.
- Replace the company contact phone placeholder in `index.html` before publishing.
