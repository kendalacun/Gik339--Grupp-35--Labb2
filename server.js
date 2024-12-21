// Importera express och sqlite3
const express = require("express");
const sqlite3 = require("sqlite3").verbose(); // Uppgift 3

// Skapa en Express-server
const server = express(); 

// Middleware för att hantera JSON, URL-enkodade data och CORS
server
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
  });

// Lyssna på port 3000
const port = 3000;
server.listen(port, () => {
  console.log(`Servern kör på http://localhost:${port}`);
});

// Uppgift 3
// Skapa en GET-route för "/users"
server.get("/users", (req, res) => {
  // Skapa en anslutning till databasen
  const db = new sqlite3.Database("./gik339-labb2.db", (err) => {
    if (err) {
      console.error("Fel vid anslutning till databasen:", err.message);
      res.status(500).send("Kunde inte ansluta till databasen");
      return;
    }
  });

  // Hämta alla användare från tabellen "users"
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      console.error("Fel vid hämtning av användare:", err.message);
      res.status(500).send("Något gick fel vid hämtning av data");
    } else {
      res.json(rows); // Skicka resultatet som JSON
    }

    // Stäng databaskopplingen
    db.close((err) => {
      if (err) {
        console.error("Fel vid stängning av databasen:", err.message);
      } else {
        console.log("Databaskopplingen är stängd.");
      }
    });
  });
});

// Skapa en route för root URL ("/")
server.get("/", (req, res) => {
  res.send("Välkommen till servern!");
});