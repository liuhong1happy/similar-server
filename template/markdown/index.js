import Application from 'similar-server/dist/application';
import Markdown from './plugins/markdown';

const app = Application();
// static plugin
app.plugin(Markdown('views'));
// init routes & plugins
app.init();
// listen 3002 port
app.listen(3002);
