var http = require('http');
var fs = require('fs');
var url = require('url');
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    //console.log(queryData.id);
    var title = queryData.id;
    //if(request.url == '/'){
      if(_url == '/'){
        //_url = '/index.html';
        title = 'Welcome';
    }
    //if(request.url == '/favicon.ico'){
      if(_url == '/favicon.ico'){
        // response.writeHead(404);
        // response.end();
        // return;
        return response.writeHead(404);
    }
    response.writeHead(200);
    //console.log(__dirname + _url);
    //response.end('egoing' + url);
    //response.end(fs.readFileSync(__dirname + _url));
    fs.readFile(`data/${queryData.id}`,'utf-8',function(err,description){
    
      var template=`
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ol>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ol>
        <h2>${title}</h2>
        <p>
        ${description}
        </p>
      </body>
      </html>
      `
      response.end(template);
    });
    
    //response.end(queryData.id);
   
     
});
app.listen(3000);