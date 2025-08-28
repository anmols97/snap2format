// File converter web server - handles file uploads and conversions
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const FileConverter = require("./lib/converter");
const FileCleanup = require("./lib/cleanup");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.use(express.json());

// File upload configuration
// Configure file storage with unique filenames
const storage = multer.diskStorage({
	destination: "./uploads/",
	filename: (req, file, cb) => {
		const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueName + path.extname(file.originalname));
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
	// Validate file types - only allow images and PDFs
	fileFilter: (req, file, cb) => {
		const allowedTypes = /pdf|png|jpg|jpeg|gif|bmp|webp/;
		const extname = allowedTypes.test(
			path.extname(file.originalname).toLowerCase()
		);
		const mimetype = allowedTypes.test(file.mimetype);

		if (extname && mimetype) {
			cb(null, true);
		} else {
			cb(new Error("Only image and PDF files are allowed"));
		}
	},
});

const converter = new FileConverter();
const cleanup = new FileCleanup();

// Initialize app directories and cleanup job
async function initializeApp() {
	try {
		await fs.mkdir("./uploads", { recursive: true });
		await fs.mkdir("./converted", { recursive: true });

		// Start cleanup job (runs every hour)
		cleanup.startCleanupJob();

		console.log("App initialized successfully");
	} catch (error) {
		console.error("Failed to initialize app:", error);
	}
}

// Routes
// Serve main page
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle file upload and conversion
app.post("/convert", upload.single("file"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		const { format } = req.body;
		if (!format) {
			return res.status(400).json({ error: "Target format not specified" });
		}

		const result = await converter.convertFile({
			inputPath: req.file.path,
			outputFormat: format,
			originalName: req.file.originalname,
		});

		res.json({
			success: true,
			downloadUrl: `/download/${result.filename}`,
			originalName: req.file.originalname,
			convertedName: result.filename,
		});
	} catch (error) {
		console.error("Conversion error:", error);
		res.status(500).json({
			error: "Conversion failed",
			message: error.message,
		});
	}
});

// Handle file downloads
app.get("/download/:filename", async (req, res) => {
	try {
		const filename = req.params.filename;
		const filePath = path.join(__dirname, "converted", filename);

		// Check if file exists
		await fs.access(filePath);

		res.download(filePath, (err) => {
			if (err) {
				console.error("Download error:", err);
				res.status(404).json({ error: "File not found" });
			}
		});
	} catch (error) {
		res.status(404).json({ error: "File not found" });
	}
});

// Error handling
app.use((error, req, res, next) => {
	if (error instanceof multer.MulterError) {
		if (error.code === "LIMIT_FILE_SIZE") {
			return res
				.status(400)
				.json({ error: "File too large. Maximum size is 10MB" });
		}
	}

	console.error("Server error:", error);
	res.status(500).json({ error: "Server error occurred" });
});

initializeApp().then(() => {
	app.listen(PORT, () => {
		console.log(`File Converter running on http://localhost:${PORT}`);
	});
});
