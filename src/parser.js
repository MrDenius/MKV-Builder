const path = require("path");
const fs = require("fs");
const mkv = require("./mkv");

module.exports = (folder) => {
	const api = () => {};

	let folderSettings = {
		Video: [],
		Audio: [],
		Subtitle: [],
	};

	const ParseDir = (dir, onFolder, onFile) => {
		fs.readdirSync(dir).forEach((file) => {
			if (fs.statSync(path.join(dir, file)).isFile()) {
				if (onFile) onFile(file, dir);
			} else {
				if (onFolder) onFolder(file, dir);
			}
		});
	};

	const GetDirManifest = (dir) => {
		if (fs.existsSync(path.join(dir, "manifest.json")))
			return JSON.parse(
				fs.readFileSync(path.join(dir, "manifest.json")).toString()
			);
	};

	const ParseFolderSetting = () => {
		const manifest = GetDirManifest(folder);
		if (!manifest)
			ParseDir(
				folder,
				(dir) => {
					[language, type] = dir.toLowerCase().split(" ");

					if (type === "audio" || type === "sound") {
						ParseDir(path.join(folder, dir), undefined, (file) => {
							const settings = ParseName(file);
							settings.path = path.join(folder, dir, file);
							settings.language = settings.language || language;
							// settings.name = settings.name || language;

							folderSettings.Audio.push(settings);
						});
					}

					if (type === "subs") {
						ParseDir(
							path.join(folder, dir),
							(dirSigns) => {
								if (
									dirSigns.toLowerCase() === "signs" ||
									dirSigns.toLowerCase() === "надписи"
								) {
									ParseDir(
										path.join(folder, dir, dirSigns),
										undefined,
										(file) => {
											const settings = ParseName(file);
											settings.path = path.join(
												folder,
												dir,
												dirSigns,
												file
											);

											settings.language =
												settings.language || language;
											settings.name =
												settings.name || "Signs";

											folderSettings.Subtitle.push(
												settings
											);
										}
									);
								}
							},
							(file) => {
								const settings = ParseName(file);
								settings.path = path.join(folder, dir, file);
								settings.language =
									settings.language || language;
								settings.name = settings.name || "Full";

								folderSettings.Subtitle.push(settings);
							}
						);
					}
				},
				(file) => {
					const settings = ParseName(file);
					settings.path = path.join(folder, file);

					folderSettings.Video.push(settings);
				}
			);
		else folderSettings = manifest;

		Object.entries(folderSettings).forEach(([key, value]) => {
			folderSettings[key] = value.filter((value) => {
				if (!value.index) return false;

				return true;
			});
		});
	};

	const ParseName = (name) => {
		const settings = {};

		name = name.replace(path.extname(name), "");
		const params = name.split("&");

		params.forEach((param) => {
			param = param.trim().split("=");
			let key = param[0].trim();
			let value;
			if (param.length === 2) value = param[1].trim();

			settings[key] = value;
		});

		console.log(settings);

		return settings;
	};

	ParseFolderSetting();
	return folderSettings;
};
