const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const taskRoutes = require("./routes/tasks");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("./public")); // serve static files from the "public" directory
app.use(express.urlencoded({ extended: true })); // parse form POST data
app.use(methodOverride("_method")); // support PUT and DELETE methods via query parameter

app.use("/", taskRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));