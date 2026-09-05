require("dotenv").config({
    path: "./fintechApp/.env"
});
const dns = require("dns");

// Use Google DNS for DNS lookups
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const app = require("./app");
const connectDB = require("./config/database");

const PORT = process.env.PORT || 8000;

connectDB();


app.listen(PORT, () => {
    console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
    );
});