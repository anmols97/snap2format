// File cleanup utility - removes old files periodically
const fs = require("fs").promises;
const path = require("path");

class FileCleanup {
	constructor(maxAge = 60 * 60 * 1000) {
		// 1 hour default
		this.maxAge = maxAge;
		this.cleanupInterval = null;
	}

	// Start periodic cleanup job
	startCleanupJob() {
		// Run cleanup every hour
		this.cleanupInterval = setInterval(() => {
			this.cleanupOldFiles();
		}, this.maxAge);

		console.log("File cleanup job started");
	}

	// Stop the cleanup job
	stopCleanupJob() {
		if (this.cleanupInterval) {
			clearInterval(this.cleanupInterval);
			this.cleanupInterval = null;
			console.log("File cleanup job stopped");
		}
	}

	// Clean up old files in both directories
	async cleanupOldFiles() {
		try {
			await this.cleanupDirectory("./uploads");
			await this.cleanupDirectory("./converted");
			console.log("File cleanup completed");
		} catch (error) {
			console.error("Error during file cleanup:", error);
		}
	}

	// Remove old files from a specific directory
	async cleanupDirectory(dirPath) {
		try {
			const files = await fs.readdir(dirPath);
			const now = Date.now();

			for (const file of files) {
				const filePath = path.join(dirPath, file);
				const stats = await fs.stat(filePath);

				if (now - stats.mtime.getTime() > this.maxAge) {
					await fs.unlink(filePath);
					console.log(`Deleted old file: ${file}`);
				}
			}
		} catch (error) {
			console.error(`Error cleaning directory ${dirPath}:`, error);
		}
	}
}

module.exports = FileCleanup;
