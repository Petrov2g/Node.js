const { createServer } = require("http");
const { createReadStream } = require("fs");
const { decode } = require("querystring");

const sendFile = (response, status, type, filePath) => {
  response.writeHead(status, {"Content-Type": type });
  createReadStream(filePath).pipe(response);
 };

 createServer((request, response) => {
  if(request.method === "POST") {
    let body = "";
    request.on("data", data => {
      body += data;
    })
    request.on("end", () => {
      const {name, email, message } = decode(body);
      console.log(`${name} (${email}): ${message}`);
    });
  }
     switch (request.url) {
         case "/":
             return sendFile(response, 200, "text/html", "./index.html");
         case "/dime.jpg":
        return sendFile(response, 200, "image/jpg", "./dime.jpg");
         case "/style.css":
             return sendFile(response, 200, "text/css", "./style.css");
        case "/contact.html":
            return sendFile(response, 200, "text/html", "./contact.html");
         default:
         return sendFile(response, 200, "text/html", "./404.html");
     }
 }).listen(3020);

console.log("Dime's personal website is running!");