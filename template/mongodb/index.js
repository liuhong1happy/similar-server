import Application from 'similar-server/dist/application';
import DBUtils from './utils/db';

DBUtils.init();

const app = Application();
// router
app.router(require('./router'));
// static plugin
app.static('assets');
// init routes & plugins
app.init();
// listen 3002 port
app.listen(3002);

