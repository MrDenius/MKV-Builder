const path = require("path");
const fs = require("fs");

module.exports = (() => {
	const api = () => {};

	const MANIFEST_VERSION = "1.0";

	const ParseDir = (dir, onFolder, onFile) => {
		fs.readdirSync(dir).forEach((file) => {
			if (fs.statSync(path.join(dir, file)).isFile()) {
				if (onFile) onFile(file, dir);
			} else {
				if (onFolder) onFolder(file, dir);
			}
		});
	};

	const CreateManifest = (manifest) => {
		const manifPath = path.join(
			path.dirname(manifest.Video[0].path),
			"manifest.json"
		);
		console.log(manifPath);
		if (fs.existsSync(manifPath)) fs.unlinkSync(manifPath);
		fs.writeFileSync(manifPath, JSON.stringify(manifest, null, 2));
	};

	const GenerateManifest = (settings) => {
		/**
		 *
		 * @param {string} name
		 * @returns
		 */
		const GetIndex = (name) => {
			name = name.replace(path.extname(name), "");

			if (settings.indexMask) name = name.match(settings.indexMask);
			if (Number.isNaN(Number(name))) name = name.match(/\d*/g);

			name = name.filter((el) => el !== "");

			return Number(name[settings.indexPosition || 0]);
		};
		settings.manifest = {
			Video: [],
			Audio: [],
			Subtitle: [],
		};

		const folderSettings = settings.manifest;
		const folder = settings.root;
		ParseDir(
			folder,
			(dir) => {
				[language, type] = dir.toLowerCase().split(" ");

				if (type === "audio" || type === "sound") {
					let i = 1;
					ParseDir(
						path.join(folder, dir),
						(dirSound) => {
							ParseDir(
								path.join(folder, dir, dirSound),
								undefined,
								(file) => {
									const fileSettings = {
										index: GetIndex(file),
									};
									fileSettings.path = path.join(
										folder,
										dir,
										dirSound,
										file
									);
									fileSettings.language =
										fileSettings.language || language;
									fileSettings.name =
										fileSettings.name || dirSound;
									if (i === settings.default.Audio)
										fileSettings.default = true;

									folderSettings.Audio.push(fileSettings);
								}
							);
							i++;
						},
						(file) => {
							const fileSettings = {
								index: GetIndex(file),
							};
							fileSettings.path = path.join(folder, dir, file);
							fileSettings.language =
								fileSettings.language || language;
							// settings.name = settings.name || language;
							if (i === settings.default.Audio)
								fileSettings.default = true;

							folderSettings.Audio.push(fileSettings);
						}
					);
				}

				if (type === "subs") {
					ParseDir(
						path.join(folder, dir),
						(dirSigns) => {
							if (dirSigns.toLowerCase() === "signs") {
								ParseDir(
									path.join(folder, dir, dirSigns),
									undefined,
									(file) => {
										const fileSettings = {
											index: GetIndex(file),
										};
										fileSettings.path = path.join(
											folder,
											dir,
											dirSigns,
											file
										);

										fileSettings.language =
											fileSettings.language || language;
										fileSettings.name =
											fileSettings.name || "Signs";

										folderSettings.Subtitle.push(
											fileSettings
										);
									}
								);
							}
						},
						(file) => {
							const fileSettings = {
								index: GetIndex(file),
							};
							fileSettings.path = path.join(folder, dir, file);
							fileSettings.language =
								fileSettings.language || language;
							fileSettings.name = fileSettings.name || "Full";

							folderSettings.Subtitle.push(fileSettings);
						}
					);
				}
			},
			(file) => {
				const fileSettings = {
					index: GetIndex(file),
					language: settings.language?.Video,
				};
				fileSettings.path = path.join(folder, file);
				fileSettings.name = settings.name;

				folderSettings.Video.push(fileSettings);
			}
		);
		Object.entries(folderSettings).forEach(([key, value]) => {
			folderSettings[key] = value.filter((value) => {
				if (!value.index || Number.isNaN(value.index)) return false;

				return true;
			});
		});

		return settings.manifest;
	};

	api.GenerateManifest = GenerateManifest;
	api.CreateManifest = CreateManifest;

	return api;
})();
