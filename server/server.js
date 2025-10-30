const express = require("express");
const app = express();
const taskRoutes = require("./routes/taskRoutes");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use("/", taskRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));