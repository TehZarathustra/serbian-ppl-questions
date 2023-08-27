import fs from "fs";
import PDFParser from "pdf2json";

const mypdfParser = new PDFParser();

mypdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
mypdfParser.on("pdfParser_dataReady", pdfData => {
		const questions = {};
		let prev = 'finished';
		let currentQuestion = '';
		let variant = '';
		const numRegex = /^([0-9]|[1-9][0-9]|[1-9][0-9][0-9])\.$/;

		const parseItem = (item) => {
			if (prev === 'finished') {
				if (numRegex.test(item)) {
					currentQuestion = item.replace('.', '');
					prev = 'title';
				}

				return;
			}

			if (prev === 'title') {
				if (!(/^[A-d].$/.test(item))) {
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
				if (/^[A-d].$/.test(item)) {
					variant = item[0];

					curr.variants = {
						...curr.variants,
						[variant]: ''
					};

					return;
				}

				// DRY
				if (numRegex.test(item)) {
					currentQuestion = item.replace('.', '');
					prev = 'title';
					return;
				}

				curr.variants[variant] = curr.variants[variant] + item;
			}
		};

		pdfData.Pages.forEach(page => {
			page.Texts.forEach(item => parseItem(decodeURIComponent(item.R[0].T)));
		});

		// pdfData.Pages[2].Texts.forEach(item => parseItem(decodeURIComponent(item.R[0].T)));
		console.log('stack >>>', questions);
		fs.writeFile("./air_law.json", JSON.stringify(questions), () => console.log('done'));
});

mypdfParser.loadPDF("./air_law.pdf");
