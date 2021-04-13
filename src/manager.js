const mkv = require("./mkv");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

module.exports = (() => {
	const api = () => {};

	let query = [];

	const CreateQuery = (settings) => {
		query = [];
		let indexes = [];
		let i = 0;

		const GetQueryIndex = (index) => {
			return Number(indexes.findIndex((el) => el === index));
		};

		settings.Video.forEach((s) => {
			indexes.push(s.index);
			query[GetQueryIndex(s.index)] = {
				Video: s,
				Audio: [],
				Subtitle: [],
			};
		});
		query = query.filter((s) => s?.Video);
		settings.Audio.forEach((s) => {
			if (GetQueryIndex(s.index) != -1)
				query[GetQueryIndex(s.index)].Audio.push(s);
		});
		settings.Subtitle.forEach((s) => {
			if (GetQueryIndex(s.index) != -1)
				query[GetQueryIndex(s.index)].Subtitle.push(s);
		});

		query = query.sort(
			(a, b) => Number(a.Video.index) - Number(b.Video.index)
		);
	};

	let outputPath = "";
	const CreateFoldersQuery = (query) => {
		const CreateLinkToOutput = () => {
			if (
				fs.existsSync(
					path.join(path.dirname(query[0].Video.path), "LastOutput")
				)
			)
				fs.rmdirSync(
					path.join(path.dirname(query[0].Video.path), "LastOutput")
				);
			child_process.spawn("cmd.exe", [
				"/C",
				"mklink",
				"/D",
				path.join(path.dirname(query[0].Video.path), "LastOutput"),
				outputPath,
			]);
		};

		const outputFolder = path.join(
			path.dirname(query[0].Video.path),
			"Output"
		);

		const date = new Date();

		outputPath = path.join(
			outputFolder,
			date.toLocaleDateString() +
				" " +
				date.toLocaleTimeString().replace(/\:/g, "-")
		);

		console.log(outputFolder);
		console.log(outputPath);

		if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);

		if (fs.existsSync(outputPath))
			fs.rmdirSync(outputPath, { recursive: true });
		fs.mkdirSync(outputPath);
		CreateLinkToOutput();
	};

	const StartBuilding = (settings) => {
		CreateQuery(settings);
		CreateFoldersQuery(query);

		let i = 0;
		const Start = () => {
			const q = query[i];
			if (!q) return;
			console.log(q);
			let index = String(q.Video.index);
			if (index.length === 1) index = `0${index}`;
			mkv(
				path.join(outputPath, `[${index}] ${q.Video.name}.mkv`)
			).AddToCon(q.Video.path, [
				{ language: q.Video.language },
				{ language: q.Video.language },
			]);
			q.Audio.forEach((s) => {
				mkv.AddToCon(s.path, {
					language: s.language.substr(0, 2).toLowerCase(),
					name: s.name,
					default: s.default,
				});
			});
			q.Subtitle.forEach((s) => {
				mkv.AddToCon(s.path, {
					language: s.language.substr(0, 2).toLowerCase(),
					name: s.name,
					default: s.default,
				});
			});
			const pr = mkv.Start();
			pr.on("exit", () => {
				i++;
				Start();
			});
			pr.stdout.on("data", (data) => console.log(data.toString()));
		};

		Start();

		// console.log(query);
		//console.log(query[0]);
	};

	api.StartBuilding = StartBuilding;

	return api;
})();
