var http = require('http');
var fs = require('fs');
var url = require('url');
const { strictEqual } = require('assert');
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  //console.log(queryData.id);

  var pathname = url.parse(_url, true).pathname;

  function templateHTML(title, list, body) {
    return `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <a href="/create">ceate</a>
           ${body}
          </body>
          </html>
          `;

  }
  function templateList(filelist) {
    var list = '<ol>';

    for (i of filelist) {
      list += `<li><a href="/?id=${i}">${i}</a></li>`;
    }

    list += '</ol>';
    return list;
  }

  //if(request.url == '/'){
  /* if(_url == '/'){
    //_url = '/index.html';
    title = 'Welcome';
  }
//if(request.url == '/favicon.ico'){
  if(_url == '/favicon.ico'){
    // response.writeHead(404);
    // response.end();
    // return;
    return response.writeHead(404);
} */
  //response.writeHead(200);
  //console.log(__dirname + _url);
  //response.end('egoing' + url);
  //response.end(fs.readFileSync(__dirname + _url));

  console.log(url.parse(_url, true).pathname);

  if (pathname === '/') {
    if (queryData.id === undefined) {

      //fs.readFile(`data/${queryData.id}`,'utf-8',function(err,description){

      fs.readdir('./data', function (error, filelist) {
        console.log(filelist);
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        /*
         var list =`      <ol>
           <li><a href="/?id=HTML">HTML</a></li>
           <li><a href="/?id=CSS">CSS</a></li>
           <li><a href="/?id=JavaScript">JavaScript</a></li>
         </ol>`;
         */
        var list = templateList(filelist);
        /* '<ol>';

      for (i of filelist) {
        list += `<li><a href="/?id=${i}">${i}</a></li>`;
      }

      list += '</ol>'; */

        var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
        response.writeHead(200);
        response.end(template);
      });

      //});
    } else {
      fs.readdir('./data', function (error, filelist) {
        console.log(filelist);

        /*
          var list =`      <ol>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ol>`;
          */
        var list = templateList(filelist);

        fs.readFile(`data/${queryData.id}`, 'utf-8', function (err, description) {
          var title = queryData.id;
          var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
          response.writeHead(200);
          response.end(template);
        });
      });
    }

  } else if (pathname === '/create') {
    //fs.readFile(`data/${queryData.id}`,'utf-8',function(err,description){

    fs.readdir('./data', function (error, filelist) {
      console.log(filelist);
      var title = 'WEB - create';
      //var description = 'Hello, Node.js';
      var list = templateList(filelist);
      var template = templateHTML(title, list,
        `
         <form action="http://localhost:3000/process_create" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `
      );
      response.writeHead(200);
      response.end(template);
    });

  } else {
    response.writeHead(404);
    response.end('Not found');
  }



  //response.end(queryData.id);


});
app.listen(3000);