

const express = require('express');
const morgan = require('morgan');

const app = express();

const blogPostRouter = require('./blogPostRouter');

//log the http layer
app.use(morgan('common'));

app.use('/blog-posts', blogPostRouter);

//Creating server object to use in runServer and closeServer, value will be assigned once the runServer runServer
let server;

//function to start the server
function runServer(){
  const port = process.env.PORT || 8080;
  return new Promise((resolve,reject) =>{
    server = app.listen(port, () =>{
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err =>{
      reject(err)
    });
  });
}

//function to close the server connection
function closeServer(){
  return new Promise((resolve, reject)  =>{
    console.log('Closing server');
      server.close(err =>{
      if(err){
        reject(err);
      return;
      }
      resolve();
    });
  });
}


//if server is called directly with node server.js the following block works
if(require.main === module){
  runServer().catch(err => console.error(err));
}

//we also export the runServer command so other code like test code) can start the server as needed.

module.exports = {app,runServer, closeServer};
