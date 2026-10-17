// Local development entry point. On Vercel, api/index.js is used instead.

const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, // optional: your main Vercel URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow tools like Postman (no origin), listed origins, and any *.vercel.app site
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^https:\/\/hirelanee.*\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

const app = require('./app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
