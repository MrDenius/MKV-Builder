module.exports = (path) => {
	const fs = require("fs");
	const ChildProcess = require("child_process");

	let args = [];
	const api = () => {};

	const SpawnMkvmerge = (args) => {
		return ChildProcess.spawn(path, args);
	};

	const AddArgument = (name, value) => {
		args.push(name);
		value ? args.push(value) : undefined;
		return api;
	};

	const Start = () => {
		const mkvm = SpawnMkvmerge(args);
		args = [];
		return mkvm;
	};

	api.AddArgument = AddArgument;
	api.Start = Start;
	api.args = args;

	return api;
};
