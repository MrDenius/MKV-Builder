const cli = require("cli");
const chalk = require("chalk");
const path = require("path");
const Parser = require("./parser");
const Manager = require("./manager");

const log = (text) => cli.debug(text);

let EPISOD = "07";
const EPISODS = ["09", "10", "11", "12"];
// const EPISODS = ["S1", "S2", "S3", "S4", "S5", "S6"];

const Main = () => {
	// Manager.StartBuilding(Parser(path.join(__dirname, `..\\Test2\\`)));
	Manager.StartBuilding(
		Parser(
			`D:\\Загрузки\\!Torrent\\No Game No Life - Zero [BDRip 1080p x264 FLAC]\\`
		)
	);
};

log("Start");
Main();
log("End.");
