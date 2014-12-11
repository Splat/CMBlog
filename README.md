###CMBlog
CloudMine allows your in-house development resources to focus their attention on creating unique, high 
value business logic and front-end interfaces. By offering all mobile back-end architecture out of the 
box, CloudMine's customers have reduced their mobile app development time and cost by 40% - 60%. Once 
deployed, the platform takes almost all of the manual steps out of maintaining applications and their 
associated data sets, freeing up your team to focus on what really matters: your busines.

This is a very basic demonstration of only writing front-end code for a full fledged blogging platform. 
CMBlog uses a few components in it's setup to ensure best practices when using AngularJS as the primary
technology in a new application. 
###SETUP
While the end result of CMBlog is an index.html file that can be run without running a server, NodeJS
is required for sanity checks running Grunt and Karma. Prerequisites are the following:

-NodeJS v0.10.x+
-npm
-Git

Optionally Yeoman and Bower are recommended for quickly scaffolding out new functionality and also
managing dependency versions such as jQuery and Bootstrap. 

You can easily check your Node and npm version by running:
```
node --version && npm --version
```
Upgrade if necessary by installing the .msi (Windows) or .pkg (Mac) from the NodeJS website. 

Next install the Yeoman toolset if you choose to by running:
```
npm install --global yo
```
Depending on the configuration of the developer machine it may require sudo permissions to run. Once
completed the machine should have yo, bower, and grunt installed. It is recommended that you ensure
they are installed by running the --version command on each of those frameworks. If any issues occur
please consult the Yeoman documentation for installation on your platform. 

You will also need to install the listed Bower components in the bower.json file located within the 
app directory. You can do this running the command:
```
bower install
```
The Bower components have been excluded from git to save space which necessitates the need to run the
install command. 
###TOUR
Checkout the CMBlog repository into your working directory and open up the root folder. The general
directory structure of the application is as follows:

1. app: a parent directory for our web application
  * cloudmine.js: the current platform js library connector. see => https://cloudmine.me/docs/js
  * index.html: the base html file for our Angular app
  * 404.html, favicon.ico, and robots.txt: every site needs them!
  * bower_components: a home for our JavaScript/web dependencies, installed by Bower
  * scripts: our own JS files
    * app.js: our main Angular application code
    * controllers: our Angular controllers which are used to drive the views which they are bound to
    * services: here is the service classes that act as adapters to the middleware Cloudmine library
  * styles: the current CSS theming
  * views: all the html which gets injected by angular to the one page site
2. Gruntfile.js, package.json, and node_modules: configuration and dependencies required by our Grunt tasks
3. test and karma.conf.js/karma-e2e.conf.js: a scaffolded out test runner and the unit tests for the project, 
including boilerplate tests for our controllers.

###PREVIEW
Now that everything is installed, the application is viewable! Just navigate to the index.html file 
that is contained in the app directory and voila! You should see some garbage data from a sample 
Cloudmine data store. Applications are initialized with a specific app and api key within the
cloudmineService.js file in the services directory. Take a look at the appOpts variable to see how it 
is configured. Consult the Cloudmine documentation if unsure of any key/val pairs and the implications
of them. Cloudmine offers a lot of options regarding configurations when interacting with such a powerful
platform. For now the application is using a dummy key with dummy data out of the box. If you want to log
into the application send a note and you can be added as an admin for that APPId. Otherwise, create a new
application on the Cloudmine platform and swap in your values. If you would like to stub out some pre-
existing data in the dashboard the json shapes are as follows:

#####ABOUT: The objects which fill the about page with details regarding the site.
```JavaScript
{
	"__class__": "About",
	"blurb": " SOME BLURBY TEXT",
	"__created__": "2014-06-19T12:25:54Z", 
	"__updated__": "2014-06-19T12:28:22Z",
	"__order__": 1 // the order in which it will display on the page
}
```
#####TODO: The objects which are visible to admin users when logged in.
```JavaScript
{
	"description": "Build this thing!",
	"__class__": "Todo",
	"__created__": "2014-06-18T16:11:20Z",
	"__id__": "2b53a5543e27a44d73d9bd893727b1a5",
	"__updated__": "2014-06-18T16:11:20Z"
}
```
#####POST: The objects which make a blog post
```JavaScript
{
	"__class__": "Post",
	"__created__": "2014-06-19T13:05:22Z",
	"__updated__": "2014-06-19T13:06:33Z",
	"__order__": 1,
	"title": "A Dev Story",
	"abstract": "A short description.",
	"fullText": "A long description. ADDING THIS SENTENCE TO MAKE MORE CHARS THAN ABSTRACT."
}
```
####APPINFO: The object which tell a little story about the application.
```JavaScript
{
	"__class__": "AppInfo",
	"__created__": "2014-06-19T13:18:10Z",
	"__updated__": "2014-06-19T13:18:10Z",
	"appName": "SOME NAME",
	"author": "SOME PERSON",
	"description": "SOME FACTS"
}
```
#####ACCESS: ######The object which tells the application whether a logged in user is an admin or not. This will eventually become a list of permissions and have a full permissioning system.
```JavaScript
{
	"__class__": "Access",
	"isAdmin": true
}
```


