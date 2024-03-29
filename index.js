import fsPromises from 'node:fs/promises';
import PDFParser from 'pdf2json';

const checkIfTrash = item => {
	// PPL (A) –
	const ppla_regex = /PPL \(A\) –/;
	// Latest information about
	const latest_info_regex = /Latest information about/;
	// www.cad.gov
	const cad_regex = /www.cad.gov/;
	// 2 / 27
	const page_regex = /[0-9] \/ [0-9]/;
	// PPL FPP-8e.jpg
	const image_regex = /PPL FPP-8e.jpg/;
	// see Figure PPL Nav-1
	const see_figure_regex = /see Figure PPL Nav-1/;
	// Latest informa
	const latest_info_regex_2 = /Latest informa/;
	const TRASH = [
		ppla_regex,
		latest_info_regex,
		latest_info_regex_2,
		cad_regex,
		page_regex,
		image_regex,
		see_figure_regex
	];

	return TRASH.some(regex => regex.test(item));
};

const onReady = filename => pdfData => {
	const questions = {};
	// 470 fpm.  4 - an example of an item with trailing question
	// update regex below

	const questionRegex = /^([0-9]|[1-9][0-9]|[1-9][0-9][0-9])(\)|\.)$/;

	const variantRegex = /(^[1-4]\)|(^[A-d].$))/;
	const formatQuestion = question => question.replace('.', '').replace(')', '');
	let prev = 'finished';
	let currentQuestion = '';
	let variant = '';

	const parseItem = item => {
		if (checkIfTrash(item)) return;

		if (prev === 'finished') {
			if (questionRegex.test(item)) {
				currentQuestion = formatQuestion(item);
				prev = 'title';
			}

			return;
		}

		if (prev === 'title') {
			if (!variantRegex.test(item)) {
				const curr = questions[currentQuestion] || {title: '', variants: {}};

				questions[currentQuestion] = {
					...curr,
					title: curr.title ? curr.title + item : item
				}

				return;
			}

			prev = 'variants';
		}

		if (prev === 'variants') {
			const curr = questions[currentQuestion];

			if (variantRegex.test(item) && Object.keys(curr.variants).length < 4) {
				variant = item[0];

				curr.variants = {
					...curr.variants,
					[variant]: ''
				};

				return;
			}

			// DRY
			if (questionRegex.test(item)) {
				currentQuestion = formatQuestion(item);
				prev = 'title';

				return;
			}

			curr.variants[variant] = curr.variants[variant] + item;
		}
	};

	pdfData.Pages
		.forEach(page => page.Texts
		.forEach(item => parseItem(decodeURIComponent(item.R[0].T))))

	// debug each page
	// pdfData.Pages[1].Texts.forEach(item => parseItem(decodeURIComponent(item.R[0].T)))
	// console.log(questions)
	// return;

	return fsPromises.writeFile(`./parsed/${filename}.json`, JSON.stringify(questions))
};

/**
 * 1.Air law.pdf
 * 2.Aircraft general knowledge.pdf
 * 3.Flight planning and monitoring.pdf
 * 4.Human performance.pdf
 * 5.Meteorology.pdf
 * 6.Naviagtion.pdf
 * 7.Operational procedures.pdf
 * 8.Principles of flight.pdf
 * 9.Communications.pdf
 */
const PDFS = {
	air_law: '1.Air law.pdf',
	aircraft_general_knowledge: '2.Aircraft general knowledge.pdf',
	flight_planning_and_monitoring: '3.Flight planning and monitoring.pdf', // broken
	human_performance: '4.Human performance.pdf',
	meteorology: '5.Meteorology.pdf',
	navigation: '6.Navigation_ed.pdf', // broken
	procedures: '7.Operational procedures.pdf',
	principles_of_flight: '8.Principles of flight.pdf',
	communications: '9.Communications.pdf',
}

function loadPDF(parser, {path}) {
	parser.loadPDF(`./pdfs/${path}`)

	return new Promise((resolve, reject) => {
		parser.on('pdfParser_dataReady', resolve)
		parser.on('pdfParser_dataError', reject)
	})
}

Object.entries(PDFS).forEach(([filename, path], index) => {
	loadPDF(new PDFParser(), {path})
		.then(onReady(`${index + 1}.${filename}`))
		.then(() => console.log(`successfully parsed: ${path}`))
		.catch(() => console.log(`failed to parse: ${path}`))
})
