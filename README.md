# Moment 2 - Backend 
I den här momenten ska vi göra en webbapplikation där man kan hantera arbetsliverfarenheter, webbtjänsten ska kunna hantera CRUD-opperationer(Create:post, read:get, update: put, delete:delete). Det ska skapas med NodeJS, Express och en relations-databas som jag har valt SQLite. I databasen ska vi ha minst fyra fält, (id, companyname, jobtitle, location). Data från webbtjänsten ska presenteras i JSON-format. Dessutom ska webbtjänsten ha möjlighet till CROSS-origin så att det ska vara möjligt att testköra webbtjänsten från annan domän om den är publicerad.

jag har en miljökonfiguration (.env-fil) som innehåller DB_PATH=./db/cv.db som anger sökvägen till SQLite-databasen.

Server.js är skriven så här: I början har jag importerat nödvändiga paket: express(hanterar webbservern), cors(hanterar korsdomänförfrågningar), sqlite3(kommunicerar med SQLite-databasen) och dotenc(anväds för att läsa variabler från .env-filen)

Sedan har jag const app = express(); som skapar en instans av Express och sedan anger jag vilken port som servern ska lyssna på.

const dbPath = process.env.DB_PATH; const db = new sqlite3.Database(dbPath, (err) => { ... }); här har jag skapat en anslutning till SQLite-databasen med sökvägen som finns i .env-filen, om anslutningen är framgångsrik så skrev meddelandet i log och createTable() körs. det är en funktion som skapar tabell med namnet workexperience (om den inte redan finns i databasen) tabellen innehåller fyra kolumnen (enligt uppgiftsbeskrivningen): id, companyname, jobtitle, location.

Sedan har jag två Middleware, app.use(cors()); som hanterar korsdomänförfrågningar och app.use(express.json()); som tolkar JSON-förfrågningar.

app.get("/api", (req, res) => { res.json({ message: "Welcome to the work experience API!" }); }); den här routen svarar på GET-förfråganingat till "/api" och skickar tillbaka ett meddelande i format av JSON-object.

Nästa del är den viktigaste delen som hanterar arbetslivserfarenheter. app.get("/api/workexperience", (req, res) => {...}); det hämtar alla arbetlivserfarenheter från databasen. app.post("/api/workexperience", (req, res) => {...}); det lägger en ny arbetslivserfarenhet till databasen. app.put("/api/workexperience/:id", (req, res) => {...}); det uppdaterar en befintlig arbetslivserfarenhet baserad på dess id. app.delete("/api/workexperience/:id", (req, res) => {...}); det raderar en befintlig arbetslivserfarenhet baserat på dess id.

Och sedan har jag felhanteringarna, den ena sätter 404-felstatus och passerar vidare till global felhantering. Den andra felhanterar som fångar alla andra typer av fel som kan uppstå under körningen och skickar tillbaka ett lämpligt felmeddelande som JSON-svar.

Till slut har jag app.listen(port, () => {...}); här strtas servern och börjar lyssna på den specifika porten. När servern startar loggas ett meddelande till konsolen för att indikera att den är igång.
