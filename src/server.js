import express from "express";
import path from "path";
import methodOverride from "method-override";
import route from "./routes/index.js";
import { fileURLToPath } from "url";

// Tạo __dirname tương thích với ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Cấu hình view engine EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware xử lý form và override method
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Routes
route(app);

// Cổng server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
