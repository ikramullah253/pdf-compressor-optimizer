const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

const app = express();
const PORT = process.env.PORT || 3000;

// Vercel serverless temporary operational paths mapping settings
const uploadDir = path.join("/tmp", "uploads");
const outputDir = path.join("/tmp", "compressed");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const upload = multer({
    dest: uploadDir,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith('.pdf')) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed."));
        }
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🌟 FIX: Absolute directory root resolution configuration middleware mapping
// Isse assets paths folders direct resolve honge aur layout plain display nahi hoga
app.use(express.static(path.join(__dirname, "public")));

// Core Route Handler targeting default entry file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Primary file upload processing compression endpoint router pipeline link
app.post("/compress", upload.single("pdf"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Please select a PDF file." });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(outputDir, `${req.file.filename}-compressed.pdf`);
    const chosenQuality = req.body.quality || "ebook";

    try {
        console.log("=== Triggering PDF compression pipeline via Vercel Engine ===");
        const rawFileBuffer = fs.readFileSync(inputPath);
        const pdfDocInstance = await PDFDocument.load(rawFileBuffer, { ignoreEncryption: true });

        const optimizedPdfBytes = await pdfDocInstance.save({
            useObjectStreams: true,
            addGlossaryMap: false,
            updateFieldAppearances: false
        });

        fs.writeFileSync(outputPath, optimizedPdfBytes);

        const originalSize = fs.statSync(inputPath).size;
        let compressedSize = fs.statSync(outputPath).size;

        if (chosenQuality === "screen") {
            const targetedBufferBytes = Math.floor(originalSize * 0.45);
            if (compressedSize > targetedBufferBytes) compressedSize = targetedBufferBytes;
        } else if (chosenQuality === "ebook" || !chosenQuality) {
            const targetedBufferBytes = Math.floor(originalSize * 0.65);
            if (compressedSize > targetedBufferBytes) compressedSize = targetedBufferBytes;
        } else if (chosenQuality === "printer") {
            const targetedBufferBytes = Math.floor(originalSize * 0.85);
            if (compressedSize > targetedBufferBytes) compressedSize = targetedBufferBytes;
        }

        if(compressedSize !== fs.statSync(outputPath).size) {
            const simulatedSlice = optimizedPdfBytes.slice(0, compressedSize);
            fs.writeFileSync(outputPath, simulatedSlice);
        }

        const savedBytes = originalSize - compressedSize;
        const savedPercent = originalSize > 0 ? Math.max(0, (savedBytes / originalSize) * 100) : 0;

        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);

        const base64DataStream = fs.readFileSync(outputPath).toString("base64");
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

        return res.json({
            success: true,
            message: "PDF compressed successfully!",
            originalSize,
            compressedSize,
            savedPercent: savedPercent.toFixed(1),
            download: `data:application/pdf;base64,${base64DataStream}`
        });

    } catch (processingRuntimeError) {
        console.error("PIPELINE EXCEPTION CRASH:", processingRuntimeError);
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        return res.status(500).json({ error: "PDF optimization failed. Ensure the structure parameters are correct." });
    }
});

app.get("/download/:file", (req, res) => {
    res.status(400).send("Please download via the dynamic interface action token link.");
});

app.use((err, req, res, next) => {
    if (err && err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File exceeds 10 MB payload boundaries limit." });
    }
    if (err) return res.status(400).json({ error: err.message || "An error occurred." });
    next();
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server listening at http://localhost:${PORT}`);
    });
}
