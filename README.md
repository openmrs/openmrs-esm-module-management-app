![Node.js CI](https://github.com/openmrs/openmrs-esm-module-management-app/workflows/Node.js%20CI/badge.svg) 
![](https://img.shields.io/badge/built%20with-openmrs--esm--template--app-brightgreen)

# OpenMRS ESM Module Management App

The OpenMRS ESM Module Management app is an application built using the ESM template app seed. It is meant to serve as a learning resource for our coding conventions and best practices when building a microfrontend. 

This apps mimics the System Administration Manage Module management page from the OpenMRS 2.x reference application. It allows uses manage modules. It lists all the installed modules and allows admin users to control modules using `Start`, `Stop` and `Unload` actions. Users can also view detailed information about the listed modules. This includes metadata such as the module author, version, required OpenMRS version, and more.

## Running this code

```sh
yarn  # to install dependencies
yarn start  # to run the dev server
```

- Once it is running, a browser window should open with the OpenMRS 3 application. Log in and click the `Module Management` link in the App Switcher to launch the Module Management app.

- Alternatively, you could click the `Module Management` link in the app switcher from the home page.

## Running tests

```sh
yarn run test
```