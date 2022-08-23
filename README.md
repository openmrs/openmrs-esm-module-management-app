![Node.js CI](https://github.com/openmrs/openmrs-esm-module-management-app/workflows/Node.js%20CI/badge.svg)

# OpenMRS ESM Module Management App

This repository is a module for the OpenMRS healthcare platform which enables uses to manage modules. It lists all the installed modules and allows admin users to control modules using Start, Stop and Unload actions. Users can also view detailed information about the listed modules. This includes metadata such as the module author, version, required OpenMRS version, and more. 

## Running this code

```sh
yarn  # to install dependencies
yarn start  # to run the dev server
```

Once it is running, a browser window should open with the OpenMRS 3 application. Log in and then navigate to `/openmrs/spa/module-management`. Alternatively, you could click the `Module Management` link in the app switcher from the home page.

## Running tests

```sh
yarn run test
```