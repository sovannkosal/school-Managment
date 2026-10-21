const fs = require("fs/promises");
const moment = require("moment");

const logError = async (controller, err, res) => {
    try {
        const timestamp = moment().format("DD/MM/YYYY HH:mm:ss");
        const folderPath = "./logs";
        const filePath = `${folderPath}/${controller + moment().format("YYYY-MM-DD") }.txt`;
        // Create "logs" folder if missing
        await fs.mkdir(folderPath, { recursive: true });
        const errorMessage = typeof err === 'string' ? err : (err && err.message ? err.message : String(err));
        const logMessage = `[${timestamp}] ${errorMessage}\n`;

        await fs.appendFile(filePath, logMessage);

    } catch (error) {
        console.error("Error writing to log file:", error);
    }

    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
};

module.exports = logError;
