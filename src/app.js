const cli = require("cli");
const chalk = require("chalk");
const path = require("path");
const Parser = require("./parser");
const Manager = require("./manager");
const ManifestManager = require("./manifestManager");

const log = (text) => cli.debug(text);

const PATH_ANIME =
	"D:\\Загрузки\\!Torrent\\[Kawaiika-Raws] Shingeki no Kyojin (2019) [BDRip 1920x1080 HEVC FLAC]";

const Main = (args, options) => {
	const manifestSttings = {
		root: options.root || PATH_ANIME,
		name: options.name,
		indexPosition: options["index-position"],
		default: {
			Audio: options["default-audio"],
		},
	};
	const settings = {
		manifestOnly: options.manifest,
	};

	console.log(manifestSttings);
	console.log(settings);

	ManifestManager.CreateManifest(
		ManifestManager.GenerateManifest(manifestSttings)
	);

	if (!settings.manifestOnly)
		Manager.StartBuilding(Parser(manifestSttings.root));
};

const ParseArgs = () => {
	cli.parse({
		root: ["r", "Path to folder", "folder"],
		name: ["n", "Name", "string", "Video"],
		"index-position": ["i", "Position index value", "int", 0],
		"default-audio": ["a", "Default audio", "int", 1],
		manifest: ["m", "Only create manifest", "bool", false],
		debug: [false, "Debug mode", "bool", false],
	});
};

log("Start");
ParseArgs();
cli.main(Main);
log("End.");
