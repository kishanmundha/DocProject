# Document management system | DocProject

[![Build Status](https://api.travis-ci.org/kishanmundha/DocProject.svg?branch=master)](https://travis-ci.org/kishanmundha/DocProject) [![Coverage Status](https://codecov.io/gh/kishanmundha/DocProject/branch/master/graph/badge.svg)](https://codecov.io/gh/kishanmundha/DocProject) [![Dependencies Status](https://david-dm.org/kishanmundha/DocProject/status.svg)](https://david-dm.org/kishanmundha/DocProject) [![DevDependencies Status](https://david-dm.org/kishanmundha/DocProject/dev-status.svg)](https://david-dm.org/kishanmundha/DocProject?type=dev) 

Manage your documents of project with this tool


### Configuration

Project configuration available in `config.js` file

1. `debugEnabled` provide us to log if it enabled true.
2. `enableEditDoc` provide us to a way to edit doc from client side.
3. `enableDocSave` provide us to save edited content directly from client side.
4. `searchCacheExpiry` (in seconds) expiry duration for search cached index.
5. `editDoc.autoLocalSave` store edited content in cache if any situation we lost access from browser it will restore in next session.
6. `editDoc.autoSaveDuration` (in seconds) local save duration if `autoLocalSave` enabled.
7. `editDoc.autoSaveExpiry` (in seconds) expiry duration of local save
8. `apiServiceBaseUri` : Base of all API
9. `apiLogin` : Login API Path
10. `apiSaveDoc` : Save Document API path


## Server side scripting for host project

We can host this project in any server like IIS, node, python, Apache, Java...

This project required Single entry page to handle all page so we configure project to
use `index.html` page in every request. We return file if request path have a file,
we return not found if request path is directory but there is not content and otherwise we return `index.html`

We have 2 sample script to host over project

1. node.js
2. [lite-server](https://github.com/johnpapa/lite-server)
3. MVC (IIS)

### Host project using NodeJS

#### 1. Make root folder

Copy project data (source code) in a folder `project_folder` and download [`server/node/server.js`](https://raw.githubusercontent.com/kishanmundha/DocProject/master/server/node/server.js) and copy it to `project_folder`.

#### 2. Install NodeJS

Download NodeJS and install it to system

#### 3. Installing express

``` sh
$ cd project_folder
$ npm install express
$ npm install body-parser
$ npm install jsonwebtoken

```

#### 4. Configure server.js

In `server.js` we configure setting in first code block `config`.

``` javascript
var config = {
    saveDocEnabled: true,
    gitLocalSave: true,
    gitRemoteSave: false
};
```

1. `saveDocEnabled` property enable to give permission to project to save file from client side.
2. `gitLocalSave` property enable to commit data on save changes (<span class="highlight">beta</span>)
3. `gitRemoteSave` property enable to push commit on remote server (Will be in next release)

#### 5. Start server

``` sh
$ node server.js
```
### Host project using lite-server

```
$ npm install lite-server
$ lite-server
```

### Host project on IIS using MVC

#### 1. Create new MVC Project

Open visual studio and create new project MVC template

#### 2. Configure routing

change `RouteConfig.cs` in `App_Start` to this code

``` csharp
public class RouteConfig
{
	public static void RegisterRoutes(RouteCollection routes)
	{
		// only 1 entry point
		routes.MapRoute(
		    "Default",
		    "{*path}",
		    new { controller = "Home", action = "Index" }
		);
	}
}
```

#### 3. Home Controller

change Action `Index` code

``` csharp
public ActionResult Index()
{
	return File(HttpContext.Server.MapPath("~/index.html"), "text/html");
}
```

#### 4. Publish MVC project

publish MVC project and host it on IIS. and copy document project data in hosted root folder.


## Screenshots

### Projects listing

![Project list](https://raw.githubusercontent.com/kishanmundha/DocProject/master/private/screenshots/01_ProjectList.PNG)

### Searching document

![Search](https://raw.githubusercontent.com/kishanmundha/DocProject/master/private/screenshots/02_Search.PNG)

### Document page

![Document](https://raw.githubusercontent.com/kishanmundha/DocProject/master/private/screenshots/03_Document.PNG)
