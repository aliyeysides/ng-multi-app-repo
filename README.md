## Init

Run `npm i` to install all the dependencies defined in the project's package.json file.

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4202/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project in ahead-of-time compilation. Alternatively, run `npm run build-jit` to run a just-in-time build. You must specify the desired environment by appending an npm parameter `-- --env=staging`. The build artifacts will be stored in the `dist/` directory.

**Please use jit compilation for now to avoid known issues!**

## Deploy

After running a build, deploy the output `dist/` folder to the desired server using `npm run deploy-{{environmentName}}`. Here are some predefined deploy scripts (package.json):
	
	"deploy-dev": "rsync -avzhe ssh ./dist/ root@172.31.77.41:/usr/share/apache-tomcat-8.5.6/webapps/ideas",
    "deploy-demo": "rsync -avzhe ssh ./dist/ root@172.31.77.61:/usr/share/apache-tomcat-8.5.6/webapps/ideas",
    "deploy-qa": "rsync -avzhe ssh ./dist/ root@172.31.77.51:/usr/share/apache-tomcat-8.5.6/webapps/ideas",
    "deploy-staging-1": "rsync -avzhe ssh ./dist/ root@192.168.111.71:/usr/share/apache-tomcat-8.5.6/webapps/ideas",
    "deploy-staging-2": "rsync -avzhe ssh ./dist/ root@192.168.111.73:/usr/share/apache-tomcat-8.5.6/webapps/ideas",

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
