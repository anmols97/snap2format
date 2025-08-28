// File converter - handles various image and PDF format conversions
const sharp = require("sharp");
const { PDFDocument } = require("pdf-lib");
const pdf2pic = require("pdf2pic");
const path = require("path");
const fs = require("fs").promises;

class FileConverter {
	constructor() {
		// Map conversion types to handler functions
		this.supportedConversions = {
			"pdf-to-png": this.pdfToPng.bind(this),
			"pdf-to-jpg": this.pdfToJpg.bind(this),
			"png-to-jpg": this.imageToImage.bind(this),
			"jpg-to-png": this.imageToImage.bind(this),
			"webp-to-png": this.imageToImage.bind(this),
			"webp-to-jpg": this.imageToImage.bind(this),
		};
	}

	// Main conversion function - routes to appropriate converter
	async convertFile({ inputPath, outputFormat, originalName }) {
		const inputExt = path.extname(originalName).toLowerCase().slice(1);
		const conversionKey = `${inputExt}-to-${outputFormat}`;

		if (!this.supportedConversions[conversionKey]) {
			throw new Error(
				`Conversion from ${inputExt} to ${outputFormat} not supported`
			);
		}

		const outputFilename = this.generateOutputFilename(
			originalName,
			outputFormat
		);
		const outputPath = path.join("./converted", outputFilename);

		await this.supportedConversions[conversionKey](
			inputPath,
			outputPath,
			outputFormat
		);

		// Clean up input file
		await fs.unlink(inputPath);

		return { filename: outputFilename, path: outputPath };
	}

	// Convert PDF to PNG format (first page only)
	async pdfToPng(inputPath, outputPath) {
		const convert = pdf2pic.fromPath(inputPath, {
			density: 150,
			saveFilename: "page",
			savePath: "./converted",
			format: "png",
			width: 800,
			height: 1000,
		});

		const results = await convert(1, false); // Convert first page only

		if (results.length > 0) {
			// Rename the generated file to our desired output name
			await fs.rename(results[0].path, outputPath);
		} else {
			throw new Error("Failed to convert PDF to PNG");
		}
	}

	// Convert PDF to JPG format (first page only)
	async pdfToJpg(inputPath, outputPath) {
		const convert = pdf2pic.fromPath(inputPath, {
			density: 150,
			saveFilename: "page",
			savePath: "./converted",
			format: "jpeg",
			width: 800,
			height: 1000,
		});

		const results = await convert(1, false);

		if (results.length > 0) {
			await fs.rename(results[0].path, outputPath);
		} else {
			throw new Error("Failed to convert PDF to JPG");
		}
	}

	// Convert between image formats using Sharp
	async imageToImage(inputPath, outputPath, format) {
		const sharpFormat = format === "jpg" ? "jpeg" : format;

		await sharp(inputPath).toFormat(sharpFormat).toFile(outputPath);
	}

	// Generate filename with date stamp
	generateOutputFilename(originalName, format) {
		const baseName = path.parse(originalName).name;
		const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
		return `${baseName}-${today}.${format}`;
	}

	// Get list of supported conversion types
	getSupportedConversions() {
		return Object.keys(this.supportedConversions);
	}
}

module.exports = FileConverter;
