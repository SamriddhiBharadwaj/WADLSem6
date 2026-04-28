const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 1800;

// MIME types
const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.eot': 'application/vnd.ms-fontobject',
  '.ttf': 'application/font-sfnt'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);


  // STEP 3: LIST FILES
  if (parsedUrl.pathname === "/") {
    let filesLink = "<ul>";
    res.setHeader('Content-type', 'text/html');

    const filesList = fs.readdirSync("./");

    filesList.forEach(file => {
      if (fs.statSync("./" + file).isFile()) {
        filesLink += `<li><a href="/${file}">${file}</a></li>`;
      }
    });

    filesLink += "</ul>";
    res.end("<h1>List of files:</h1>" + filesLink);
    return;
  }

  // STEP 4: SANITIZE PATH
  const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
  let pathname = path.join(__dirname, sanitizePath);

  // STEP 5: FILE SERVING
  if (!fs.existsSync(pathname)) {
    res.statusCode = 404;
    res.end(`File not found!`);
  } else {
    fs.readFile(pathname, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end("Error reading file");
      } else {
        const ext = path.parse(pathname).ext;
        res.setHeader('Content-type', mimeType[ext] || 'text/plain');
        res.end(data);
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});