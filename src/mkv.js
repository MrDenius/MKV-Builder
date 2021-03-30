const path = require("path");
const mkvmConstructor = require("./mkvmerge");

module.exports = (() => {
	const GetType = (fileName) => {
		let ext = path.extname(fileName);

		const Types = {
			Audio: ["acc"],
			Video: ["mkv"],
			Subtitle: ["ass"],
		};

		if (Types.Audio.find((el) => el === ext)) return "audio";
		if (Types.Video.find((el) => el === ext)) return "video";
		if (Types.Subtitle.find((el) => el === ext)) return "subtitle";
	};

	const GetMkvmerge = () =>
		mkvmConstructor("X:\\Program Files\\MKVToolNix\\mkvmerge.exe"); // X:\Program Files\MKVToolNix\mkvmerge.exe

	const AddToCon = (file, settings) => {
		settings = settings || {};
		if (!Array.isArray(settings)) settings = [settings];

		settings.forEach((settings) => {
			settings.type = settings.type || GetType(file);
			settings.language = settings.language || "und";
			console.log("default: ", settings.default);
			settings.default = Boolean(Number(settings.default));
		});

		settings[settings.length - 1].file = file;

		Files.push(settings);
		return api;
	};

	let output;
	let Files = [];

	const Start = () => {
		const mkvm = GetMkvmerge();

		mkvm.AddArgument("-o", output);

		Files.forEach((settings) => {
			for (let i = 0; i < settings.length; i++) {
				const s = settings[i];
				if (s.language)
					mkvm.AddArgument("--language", `${i}:${s.language}`);
				mkvm.AddArgument(
					"--default-track",
					`${i}:${s.default ? "yes" : "no"}`
				);
				console.log("default: ", s.default);
				if (s.dimensions)
					mkvm.AddArgument(
						"--display-dimensions",
						`${i}:${s.dimensions}`
					);
				if (s.name) mkvm.AddArgument("--track-name", `${i}:${s.name}`);
				if (s.file) {
					mkvm.AddArgument("(");
					mkvm.AddArgument(s.file);
					mkvm.AddArgument(")");
				}
			}
		});

		console.log(mkvm.args);
		Files = [];
		output = undefined;

		return mkvm.Start();
	};

	const api = (outputPath) => {
		output = outputPath;

		api.Start = Start;
		return api;
	};
	api.AddToCon = AddToCon;
	return api;
})();
