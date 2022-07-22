import * as autoIdentifyOportunity from "./auto-indentify-oportunity";

const fs = require('fs');

let valueMetricsOld: any[] = [];
let valueMetricsNew: any[] = [];

export function validateProject() {
	//const projeto: string = "/Users/bi004822/repos/tcc/freeCodeCamp/api-server/src";
	//const projeto: string = "/Users/bi004822/repos/tcc/javascript-algorithms/src";
	const projeto: string = "/Users/bi004822/repos/tcc/JavaScript";


	const read = require("fs-readdir-recursive");

	let filteredFiles = read(projeto).filter((item: any) => item.endsWith(".js"));

	valueMetricsOld = [];
	valueMetricsNew = [];

	let totalRefactors = 0;
	let hasRefactors = 0;

	filteredFiles.forEach((file: any) => {
		let readFile = projeto.concat("/").concat(file);

		if (fs.existsSync( readFile )) {
			let sourceCode = fs.readFileSync(readFile, 'utf8');

			validateSourceMetricts(sourceCode, file, valueMetricsOld);

			hasRefactors = autoIdentifyOportunity.countRefactorsAvaliable(sourceCode, readFile);

			if (hasRefactors > 0) {
				totalRefactors += hasRefactors;
				autoIdentifyOportunity.executeIdentifyOportunity(sourceCode, readFile);
			}

			sourceCode = fs.readFileSync(readFile, 'utf8');

			validateSourceMetricts(sourceCode, file, valueMetricsNew);
		}
	});

	saveMetrics();

	console.log("Total refactors: " + totalRefactors);
	console.log("Total refactors by type: " + autoIdentifyOportunity.getTotalRefactors());
}

function validateSourceMetricts(sourceCode: any, file: any, structure: any): any {
	let metrics: any;

	try {
		metrics = getSourceMetrics(sourceCode);
	} catch (e) {
		console.log("erro ao coletar métricas do arquivo: " + file);
		console.error(e);

		return;
	}

	metrics.methods.forEach((method: any) => {
		let methodMetrics: any[] = ["", 0, 0, 0, 0, 0, 0];

		let name = method.name;

		if (name === undefined || name.includes("anon method")) {
			name = sourceCode.split('\n')[method.lineStart-1];
		}

		methodMetrics[0] = file + " - " + name;
		methodMetrics[1] = method.cyclomatic;
		methodMetrics[2] = method.halstead.difficulty;
		methodMetrics[3] = method.halstead.time;
		methodMetrics[4] = metrics.classes.length;
		methodMetrics[5] = metrics.methods.length;
		methodMetrics[6] = method.sloc.logical;

		structure.push(methodMetrics);
	});

	metrics.classes.forEach((classe: any) => {
		classe.methods.forEach((method: any) => {
			let methodMetrics: any[] = ["", 0, 0, 0, 0, 0, 0];
			let name = method.name;

			if (name === undefined || name.includes("anon method")) {
				name = sourceCode.split('\n')[method.lineStart-1];
			}
	
			methodMetrics[0] = file + " - " + name;
			methodMetrics[1] = method.cyclomatic;
			methodMetrics[2] = method.halstead.difficulty;
			methodMetrics[3] = method.halstead.time;
			methodMetrics[4] = metrics.classes.length;
			methodMetrics[5] = metrics.methods.length;
			methodMetrics[6] = method.sloc.logical;
	
			structure.push(methodMetrics);
		});
	});
}

function getSourceMetrics(sourceCode: any): any {
	var escomplex = require('typhonjs-escomplex');

	return escomplex.analyzeModule(sourceCode);
}

function saveMetrics() {
	generateCsvFile("cyclomatic");
	generateCsvFile("difficulty");
	generateCsvFile("time");
	generateCsvFile("classes");
	generateCsvFile("methods");
	generateCsvFile("lloc");
}

function generateCsvFile(metric: any) {
	let position = 0;

	switch (metric) {
		case 'cyclomatic':
			position = 1;
			break;
		case 'difficulty':
			position = 2;
			break;
		case 'time':
			position = 3;
			break;
		case 'classes':
			position = 4;
			break;
		case 'methods':
			position = 5;
			break;
		case 'lloc':
			position = 5;
			break;
	}

	if ((valueMetricsOld.length > 0 && valueMetricsNew.length > 0) && position > 0) {
		const header = ['Método', 'Métrica antes', 'Métrica depois'];

		let data: any[] = [];
		let methodMetric: any[] = ["", 0, 0];

		valueMetricsOld.forEach((value: any, index) => {
			methodMetric = ["", 0, 0];

			let positionNew = valueMetricsNew.map(element => element[0] === value[0]).indexOf(true);

			let metricOld = value[position];

			let metricNew = positionNew < 0 ? 0 : valueMetricsNew[positionNew][position];

			if (metricOld !== metricNew) {
				methodMetric[0] = value[0].split(" - ")[0];
				methodMetric[1] = metricOld;
				methodMetric[2] = metricNew;

				data.push(methodMetric);
			}
		});

		const val = [header].concat(data).map(arr => arr.join(',')).join('\r\n');

		//const projeto = "freeCodeCamp";
		//const projeto = "javascript-algorithms";
		const projeto = "JavaScript";

		fs.writeFile('/Users/bi004822/repos/tcc/resultados/' + projeto + '/'+ metric +'.csv', val, (err: any) => {
			if(err) {
				console.error(err);
			} else {
				console.log('Ok');
			}
		});
	}
}