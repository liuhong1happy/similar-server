import Application from 'similar-server/dist/application';
import router from './router';


const app = Application();
// router
app.router(router);
// static plugin
app.static('assets');
// init routes & plugins
app.init();
// listen 3002 port
app.listen(3002);

