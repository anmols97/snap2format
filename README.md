# Snap2Format

A fast and simple web-based file converter that transforms your files between different formats with ease.

## Features

- **PDF to Image**: Convert PDF documents to PNG or JPG images
- **Image Format Conversion**: Convert between PNG, JPG, and WEBP formats
- **Drag & Drop Interface**: Intuitive file upload with drag-and-drop support
- **Automatic Cleanup**: Files are automatically cleaned up after 1 hour
- **Date-based Naming**: Output files use today's date for easy organization
- **File Size Limit**: Supports files up to 10MB

## Supported Conversions

- PDF → PNG, JPG
- PNG → JPG
- JPG → PNG  
- WEBP → PNG, JPG

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/anmols97/snap2format.git
cd snap2format
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and go to `http://localhost:3000`

### Development

To run in development mode with auto-restart:
```bash
npm run dev
```

## Usage

1. **Upload a file**: Click the upload area or drag and drop your file
2. **Select output format**: Choose your desired output format from the dropdown
3. **Convert**: Click "Convert File" and wait for processing
4. **Download**: Your converted file will be ready for download

## File Naming

Output files follow the pattern: `filename-YYYY-MM-DD.extension`

Example: `document.pdf` → `document-2025-08-27.png`

## Project Structure

```
snap2format/
├── server.js           # Express server and API endpoints
├── lib/
│   ├── converter.js    # File conversion logic
│   └── cleanup.js      # Automatic file cleanup
├── public/
│   ├── index.html      # Web interface
│   └── style.css       # Styles (embedded in HTML)
├── uploads/            # Temporary upload storage
└── converted/          # Converted files storage
```

## API Endpoints

- `GET /` - Web interface
- `POST /convert` - File conversion endpoint
- `GET /download/:filename` - Download converted files

## Technologies Used

- **Backend**: Node.js, Express.js
- **File Upload**: Multer
- **Image Processing**: Sharp
- **PDF Processing**: pdf2pic
- **Frontend**: Vanilla JavaScript, HTML5, CSS3

## License

ISC