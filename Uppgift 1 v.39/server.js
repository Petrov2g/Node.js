const { createServer } = require("http");
const { createReadStream } = require("fs");
const { decode } = require("querystring");
const mysql  = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "nodejs"
});

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
      const {namn, email, meddelande } = decode(body);
      console.log(`${namn} (${email}): ${meddelande}`);
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `INSERT INTO formular (namn, email, meddelande) VALUES ('${namn}', '${email}', '${meddelande}')`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      });
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