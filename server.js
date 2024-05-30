// importera och tilldela paket 
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

// Skapa en instans av Express
const app = express();
// Ange port 
const port = process.env.PORT || 3101;

// Skapa en anslutning till SQLite-databasen
const dbPath = process.env.DB_PATH;
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Connection failed:" + err);
    } else {

        createTable(); // Skapa tabellen när anslutningen är etablerad
    }
});
 
// Funktion för att skapa tabellen om den inte redan finns
function createTable() {
    db.run("CREATE TABLE IF NOT EXISTS workexperience (id INTEGER PRIMARY KEY AUTOINCREMENT, companyname TEXT NOT NULL, jobtitle TEXT NOT NULL, location TEXT NOT NULL)");
}

app.use(cors());
app.use(express.json());

// Välkomstmeddelande
app.get("/api", (req, res) => {
    res.json({ message: "Welcome to the work experience API!" });
});

// Hämta alla arbetslivserfarenheter
app.get("/api/workexperience", (req, res) => {
    db.all("SELECT * FROM workexperience", (err, rows) => {
        if (err) {
            res.status(500).json({ error: "Something went wrong: " + err });
            return;
        }
        if (rows.length === 0) {
            res.status(404).json({ message: "No work experience found" });
        } else {
            res.json(rows);
        }
    });
});

// Lägg till en ny arbetslivserfarenhet
app.post("/api/workexperience", (req, res) => {
    const { companyname, jobtitle, location } = req.body;
    if (!companyname || !jobtitle || !location) {
        res.status(400).json({ error: "Fyll i alla fält" });
        return;
    }
    db.run("INSERT INTO workexperience (companyname, jobtitle, location) VALUES (?, ?, ?)", [companyname, jobtitle, location], function (err) {
        if (err) {
            res.status(500).json({ error: "Something went wrong: " + err });
            return;
        }
        const newWorkExperience = {
            id: this.lastID,
            companyname,
            jobtitle,
            location
        };
        // Skicka meddelandet som en del av svaret
        res.status(201).json({ message: "Ny arbetserfarenhet har lagts till!", workExperience: newWorkExperience });
    });
});


// Uppdatera en befintlig arbetslivserfarenhet
app.put("/api/workexperience/:id", (req, res) => {
    const id = req.params.id;
    const { companyname, jobtitle, location } = req.body;
    if (!companyname || !jobtitle || !location) {
        res.status(400).json({ error: "Company name, job title, and location are required" });
        return;
    }
    db.run("UPDATE workexperience SET companyname = ?, jobtitle = ?, location = ? WHERE id = ?", [companyname, jobtitle, location, id], function (err) {
        if (err) {
            res.status(500).json({ error: "Something went wrong: " + err });
            return;
        }
        res.json({ message: "Work experience updated", id });
    });
});

// Ta bort en arbetslivserfarenhet 
app.delete("/api/workexperience/:id", (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM workexperience WHERE id = ?", id, function(err) {
        if (err) {
            res.status(500).json({ error: "Something went wrong: " + err });
            return;
        }
        res.json({ message: "Work experience deleted", id });
    });
});

// Felhantering för okända rutter
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

// Global felhantering
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message || "Internal Server Error"
        }
    });
});

// Lyssna på serverns port och logga när servern startas
app.listen(port, () => {
    console.log("Server is running on port: " + port);
});
