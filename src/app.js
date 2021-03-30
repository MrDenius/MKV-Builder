const cli = require("cli");
const chalk = require("chalk");
const path = require("path");
const Parser = require("./parser");
const Manager = require("./manager");
const ManifestManager = require("./manifestManager");

const log = (text) => cli.debug(text);

let EPISOD = "07";
const EPISODS = ["09", "10", "11", "12"];
// const EPISODS = ["S1", "S2", "S3", "S4", "S5", "S6"];

const PATH_ANIME =
	"D:\\Загрузки\\!Torrent\\[Moozzi2] Kakegurui XX [BDRip 1080p x264 FLAC]";

const Main = () => {
	// Manager.StartBuilding(Parser(path.join(__dirname, `..\\Test2\\`)));

	// console.log(
	// 	Parser(
	// 		`D:\\Загрузки\\!Torrent\\[Moozzi2] Kakegurui [BDRip 1080p x264 FLAC]`
	// 	)
	// );

	ManifestManager.CreateManifest(
		ManifestManager.GenerateManifest({
			root: PATH_ANIME,
			name: "Kakegurui XX",
			indexPosition: 1,
			default: {
				Audio: 2,
			},
		})
	);

	Manager.StartBuilding(Parser(PATH_ANIME));
};

log("Start");
Main();
log("End.");
