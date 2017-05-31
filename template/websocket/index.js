import Application from 'similar-server/dist/application';
import router from './router';
import http from 'http';
import SocketIO from 'socket.io';


const app = Application();
// router
app.router(router);
// static plugin
app.static('assets');
// init routes & plugins
app.init();

const server = http.Server(app);

const io = SocketIO(server);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('connection', function(userName){
    console.log('connection: ' + userName);
  });
});

server.listen(3002);

