const http = require("http");
const fs = require("fs");
const path = require("path");
const planets = require("./data/planets.json");

// Provide implementation
const server = http.createServer();
server.on('request', async (req, res) => {
    if(req.method === 'GET' && req.url === "/"){
        //return res.end({message:"OK"});
       let output = fs.readFileSync(path.resolve("./index.html"));
       res.setHeader('Content-Type', 'text/html');
       return res.end(output);
    }

    if(req.method === 'GET' && req.url === "/planets") return getAllPlanets(req, res);

    req.on('data', chunk => {
        if(req.method === 'POST' && req.url.startsWith("/planet/")) return editPlanet(req, res, chunk);
    });
});

server.listen(process.env.PORT ? process.env.PORT : 3000, () => {console.log(`Listening to ${process.env.PORT ? process.env.PORT : 3000}`)});

const getAllPlanets = (req, res, chuck) => {
	    //return res.end({message:"OK"});
        let planetsJson = fs.readFileSync(path.resolve("./data/planets.json"));
        let planets = JSON.parse(planetsJson);
        planets = planets.filter((el) => !isNaN(el.population* 1) && el.population > 0);
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(planets));
}

const editPlanet = (req, res, chunk) => {
    res.setHeader('Content-Type', 'application/json');
    let planetToCheck = req.url.split("/")[req.url.split("/").length - 1];

    let planetsJson = fs.readFileSync(path.resolve("./data/planets.json"));
    let planets = JSON.parse(planetsJson);

    planets = planets.filter((el) => el.id === planetToCheck);
    if (planets.length === 0) return res.end(JSON.stringify({status: 404, message: "planet not found"}));

    let data = JSON.parse(chunk);
    if (!data.surface_water) return res.end(JSON.stringify({status: 400, message: "Please check input"}));
    return res.end(JSON.stringify({status: 200, message: `Planet updated. Current surface is ${data.surface_water}`}));
}