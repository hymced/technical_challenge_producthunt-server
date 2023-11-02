# Technical Challenge : Product Hunt

Connects to Product Hunt API, fetches products created/posted at a specific date, display them with a view.\
Backend: Node TS, fetches the Product Hunt API.\
Frontend: Angular, datepicker to select the date.\
Bonus: pie chart showing the number of products by category.\
Code using best practices (Linter, Environment Variables, error handling, clean code/architecture, scalable)\

# This is only the server

**Deployed live version**: https://WIP.netlify.app/

**Backend server repo**: https://github.com/hymced/technical_challenge_producthunt-server

**Backend server API**: https://technical_challenge_producthunt-server.adaptable.app/api/

**Frontend client (React app) repo**: https://github.com/hymced/technical_challenge_producthunt-client

## Instructions

Follow these steps:
- clone 
- install dependencies: `npm install`
- create a `.env` file or add the following environment variables in your hosting service:
  - `ORIGIN`, with the location of your frontend app (example, `ORIGIN=https://foobar.netlify.com`)
  - `PH_APP_API_KEY`: your app client_id used to authorize the app with the Product Hunt API (OAuth Client Only mode)
  - `PH_APP_API_SECRET`: your app client_secret used to authorize the app with the Product Hunt API (OAuth Client Only mode)
- run the application: `npm run dev`
- build the application: `npm run build`