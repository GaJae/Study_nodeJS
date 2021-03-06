var http = require('http');
var fs = require('fs');
var url = require('url');
const { strictEqual } = require('assert');
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var qs = require('querystring');

  function templateHTML(title, list, body, control) {
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
            ${control}
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


  if (pathname === '/') {
    if (queryData.id === undefined) {

      //fs.readFile(`data/${queryData.id}`,'utf-8',function(err,description){

      fs.readdir('./data', function (error, filelist) {
        //console.log(filelist);
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

        var template = templateHTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">ceate</a> `
        );
        response.writeHead(200);
        response.end(template);
      });

      //});
    } else {
      fs.readdir('./data', function (error, filelist) {
        var list = templateList(filelist);

        fs.readFile(`data/${queryData.id}`, 'utf-8', function (err, description) {
          var title = queryData.id;
          var template = templateHTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">ceate</a> 
            <a href="/update?id=${title}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delete">
            </form>
            `
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    }

  } else if (pathname === '/create') {
    fs.readdir('./data', function (error, filelist) {
      //console.log(filelist);
      var title = 'WEB - create';
      var list = templateList(filelist);
      var template = templateHTML(title, list,
        `
         <form action="http://localhost:3000/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, ''
      );
      response.writeHead(200);
      response.end(template);
    });

  } else if (pathname === '/create_process') {
    var body = '';
    request.on('data', function (data) {//????????? ????????? ????????????????????? ?????????
      body += data;
    });
    request.on('end', function () {//??????????????? ????????????
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      //console.log(post);
      fs.writeFile(`data/${title}`, description, 'utf8',
        function (err) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
    });
  }
  else if (pathname === '/update') {
    fs.readdir('./data', function (error, filelist) {
      var list = templateList(filelist);

      fs.readFile(`data/${queryData.id}`, 'utf-8', function (err, description) {
        var title = queryData.id;
        var template = templateHTML(title, list,
          `
           <form action="/update_process" method="post">
           <input type="hidden" name="id" value ="${title}">
            <p><input type="text" name="title" placeholder="title" value ="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          
          `,
          `<a href="/create">ceate</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(template);
      });
    });
  }
  else if (pathname === '/update_process') {
    var body = '';
    request.on('data', function (data) {//????????? ????????? ????????????????????? ?????????
      body += data;
    });
    request.on('end', function () {//??????????????? ????????????
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;

      fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, 'utf8',
          function (err) {
            response.writeHead(302, { Location: `/?id=${title}` });
            response.end();
          });
      });


    });
  }
  else if (pathname === '/delete_process') {
    var body = '';
    request.on('data', function (data) {//????????? ????????? ????????????????????? ?????????
      body += data;
    });
    request.on('end', function () {//??????????????? ????????????
      var post = qs.parse(body);
      var id = post.id;

      fs.unlink(`data/${id}`, function (error) {
        response.writeHead(302, { Location: `/` });
        response.end();
      });


    });
  }
  else {
    response.writeHead(404);
    response.end('Not found');
  }



  //response.end(queryData.id);


});
app.listen(3000);