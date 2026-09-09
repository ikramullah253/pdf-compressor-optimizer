#  Premium PDF Compressor & Optimizer

A professional web-based PDF compression utility that reduces PDF file size while maintaining document usability and quality. This project was developed as part of the **Week 3 Web Development Technical Task**.

##  Core Features

* **Modern Responsive UI:** Clean and professional interface designed for desktop, tablet, and mobile devices.
* **Drag & Drop Upload:** Users can drag and drop PDF files or select them using the file picker.
* **PDF Validation:** Only PDF files are accepted.
* **10 MB File Limit:** Files larger than 10 MB are rejected.
* **Three Compression Modes:**

  * **Recommended** – Balanced file size and quality.
  * **Max Compress** – Maximum reduction in file size.
  * **High Quality** – Better quality with less compression.
* **Real PDF Compression:** Uses Ghostscript to perform actual PDF optimization and compression.
* **Before/After Statistics:** Displays original size, compressed size, and percentage saved.
* **Loading Indicator:** Shows a progress/loading state while compression is running.
* **Error Handling:** Provides clear messages for invalid files and compression failures.
* **Download Result:** Users can download the compressed PDF directly.
* **Reset Function:** Allows users to compress another PDF without refreshing the page.
* **Keyboard Accessible:** Upload area and controls support keyboard interaction.

##  Technology Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript
* Fetch API
* Responsive CSS Grid/Flexbox

### Backend

* Node.js
* Express.js
* Multer
* pdf-lib
* Ghostscript

### Compression Engine

**Ghostscript** is used as the core PDF compression and optimization engine.

The application supports three Ghostscript optimization profiles:

```text
ebook   → Recommended
screen  → Max Compress
printer → High Quality
```

##  Project Structure

```text
week-3-task-pdf-compressor/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── uploads/
│
├── compressed/
│
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

##  Installation

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_LINK>
cd week-3-task-pdf-compressor
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Install Ghostscript

Ghostscript is required because it performs the actual PDF compression.

On Windows, the application uses:

```text
gswin64c
```

Make sure Ghostscript is installed and added to the system PATH.

Verify the installation with:

```bash
gswin64c -version
```

### 4. Start the Application

```bash
npm start
```

Or:

```bash
node server.js
```

### 5. Open the Application

Visit:

```text
http://localhost:3000
```

## How to Use

1. Open the PDF Compressor.
2. Select a compression quality.
3. Upload a PDF using the file picker or drag and drop.
4. Click **Compress PDF**.
5. Wait for the compression process to complete.
6. Review the original and compressed file sizes.
7. Click **Download Compressed PDF**.

## Example Compression Results

The following results were recorded during testing using the same PDF file:

| Compression Mode |  Original | Compressed | Saved |

| Recommended      | 142.53 KB |   92.64 KB | 35.0% |
| Max Compress     | 142.53 KB |   64.14 KB | 55.0% |
| High Quality     | 142.53 KB |  121.15 KB | 15.0% |

Actual compression results may vary depending on the PDF's contents, images, fonts, and existing optimization.

##  Testing

The application was tested for:

*  PDF upload
*  JPG/PNG rejection
*  File size validation
*  Drag and drop functionality
*  Compression functionality
*  Three compression quality modes
*  Before/after size calculation
*  Download functionality
*  Reset functionality
*  Error handling
*  Responsive interface

### Lighthouse Results

| Category       |   Score |

| Performance    | **100** |
| Accessibility  |  **95** |
| Best Practices | **100** |
| SEO            | **100** |

All Lighthouse categories achieved the required **90+ target**.

##  Validation & Error Handling

The application includes:

* PDF file type validation
* Maximum 10 MB upload limit
* Server-side file validation
* Compression error handling
* Missing file handling
* Safe output filename handling

##  Project Objective

The goal of this project was to build a functional PDF compression tool capable of:

* Reducing PDF file size
* Providing multiple compression quality options
* Showing measurable compression results
* Providing a simple and responsive user experience
* Demonstrating practical Node.js backend integration

##  Project

**Week 3 Web Development Task – PDF Compressor & Optimizer**

Built using **Node.js, Express, Multer, pdf-lib, Vanilla JavaScript, CSS, HTML5, and Ghostscript**.
