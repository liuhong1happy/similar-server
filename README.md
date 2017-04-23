# similar-server

## Install

    npm install -g similar-server

## Usage

1. Create template project

        similar-server-cli AwesomeProject

2. Install node packages

        cd AwesomeProject
        npm install

3. Start Server

        npm start

4. Open [http://localhost:3002/home/Hello%20Similar%20Server!](http://localhost:3002/home/Hello%20Similar%20Server!)

## Cookie

``` js
const cookieParser = require('cookie-parser');
const Application = require('similar-server/dist/application');
const app = Application();
// cookie plugin
app.plugin(cookieParser());
app.plugin(function (req, res, next) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)
  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
  next()
})
app.listen(3002);
```

## Session

``` js
const session = require('express-session')
const Application = require('similar-server/dist/application');
const app = Application();
// session plugin
app.plugin(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.plugin(function (req, res, next) {
  var views = req.session.views
  if (!views) {
    views = req.session.views = {}
  }
  // count the views
  views[req.url] = (views[req.url] || 0) + 1
  // session
  console.log('You viewed this page ' + req.session.views[req.url] + ' times');
  next()
})
app.listen(3002);
```

## Contact

Email: [liuhong1.happy@163.com](mailto:liuhong1.happy@163.com)
