# Overview
This [node module](https://www.npmjs.com/package/errorme) helps you to  create your own errors with your defined error codes and handle them differently within your classes. Suppose we have created Archive Manager module which does database operations and is able to pass errors in callbacks. You can define your own error codes as you may have done before by doing `new Error(<error message>, <error code>)` etc.  However the difference here is that you can parse that error object into HTTP error message with appropriate error HTTP error codes by integrating it with your RESTful service.

# Features
* Creating error objects with self-defined error codes
* Parsing them to HTTP error codes and messages
* Ability to  add custom error messages in development environment and see them in the client-side of the RESTful service

# ECMAScript support
ES6 only

# Installation
`$ npm install errorme`

# How to use?
Check the docs [here](https://kmanaseryan.github.io/).

# Next features
* Will be ability to add other "error languages"
* Optimization for working with error codes defined by external service providers
    
# License
MIT        






















