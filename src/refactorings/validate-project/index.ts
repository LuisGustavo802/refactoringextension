import * as autoIdentifyOportunity from "./auto-indentify-oportunity";

const fs = require('fs');

let valueMetricsOld: any[] = [];
let valueMetricsNew: any[] = [];

let averangeValueMetricsOld: number[] = [0, 0, 0, 0, 0];
let averangeValueMetricsNew: number[] = [0, 0, 0, 0, 0];

export function validateProject() {
	const projeto: string = "/Users/bi004822/repos/tcc/freeCodeCamp/api-server/src";

	const read = require("fs-readdir-recursive");

	let filteredFiles = read(projeto).filter((item: any) => item.endsWith(".js"));

	averangeValueMetricsOld = [0, 0, 0, 0, 0];
	averangeValueMetricsNew = [0, 0, 0, 0, 0];
	valueMetricsOld = [];
	valueMetricsNew = [];

	let count = 0;

	filteredFiles.forEach((file: any) => {
		let readFile = projeto.concat("/").concat(file);

		if (fs.existsSync( readFile )) {
			count++;

			console.log("validate file: " + count);

			let sourceCode = fs.readFileSync(readFile, 'utf8');

			validateSourceMetricts(sourceCode, file, valueMetricsOld);

			autoIdentifyOportunity.executeIdentifyOportunity(sourceCode, readFile);

			sourceCode = fs.readFileSync(readFile, 'utf8');

			validateSourceMetricts(sourceCode, file, valueMetricsNew);
		}
	});

	saveMetrics();
}

function validateSourceMetricts(sourceCode: any, file: any, structure: any): any {
	let metrics: any;

	try {
		metrics = getSourceMetrics(sourceCode);
	} catch {
		console.log("erro ao coletar métricas do arquivo: " + file);

		return;
	}

	let methodMetrics: any[] = ["", 0, 0, 0, 0, 0];

	methodMetrics[0] = file;
	methodMetrics[1] = metrics.aggregateReport.cyclomatic;
	methodMetrics[2] = metrics.aggregateReport.halstead.difficulty;
	methodMetrics[3] = metrics.aggregateReport.halstead.time;
	methodMetrics[4] = metrics.classes.length;
	methodMetrics[5] = metrics.methods.length;

	structure.push(methodMetrics);

	/*metrics.methods.forEach((method: any) => {
		methodMetrics[0] = file + " - " + method.name;
		methodMetrics[1] = method.cyclomatic;
		methodMetrics[2] = method.halstead.difficulty;
		methodMetrics[3] = method.halstead.time;
		methodMetrics[4] = metrics.classes.length;
		methodMetrics[5] = metrics.methods.length;


		structure.push(methodMetrics);

	});

	methodMetrics = ["", 0, 0, 0, 0, 0];

	metrics.classes.forEach((classe: any) => {
		classe.methods.forEach((method: any) => {
			methodMetrics[0] = file + " - " + method.name;
			methodMetrics[1] = method.cyclomatic;
			methodMetrics[2] = method.halstead.difficulty;
			methodMetrics[3] = method.halstead.time;
			methodMetrics[4] = metrics.classes.length;
			methodMetrics[5] = metrics.methods.length;
	
	
			structure.push(methodMetrics);
	
		});
	});*/

	/*structure[0] = structure[0] + metrics.aggregateReport.cyclomatic;
	structure[1] = structure[1] + metrics.aggregateReport.halstead.difficulty;
	structure[2] = structure[2] + metrics.aggregateReport.halstead.time;
	structure[3] = structure[3] + metrics.classes.length;
	structure[4] = structure[4] + metrics.methods.length;*/
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
	}

	if ((valueMetricsOld.length > 0 && valueMetricsNew.length > 0) && position > 0) {
		const header = ['Método', 'Métrica antes', 'Métrica depois'];

		let data: any[] = [];
		let methodMetric: any[] = ["", 0, 0];

		valueMetricsOld.forEach((value: any, index) => {
			methodMetric = ["", 0, 0];

			methodMetric[0] = value[0];
			methodMetric[1] = value[position];
			methodMetric[2] = valueMetricsNew[index][position];

			data.push(methodMetric);
		});

		const val = [header].concat(data).map(arr => arr.join(',')).join('\r\n');

		fs.writeFile('/Users/bi004822/repos/tcc/resultados/freeCodeCamp/'+ metric +'.csv', val, (err:any) => {
			if(err) {
				console.error(err);
			} else {
				console.log('Ok');
			}
		});
	}
}

function printTotals(projeto: any, filesQtd: any) {
	console.log("Executada a validação do projeto: " + projeto);
	console.log(filesQtd + " arquivos validados");

	console.log(" ");

	console.log("Metricas antes da refatoração:");
	console.table(averangeValueMetricsOld);

	console.log(" ");

	console.log("Metricas depois da refatoração:");
	console.table(averangeValueMetricsNew);
}