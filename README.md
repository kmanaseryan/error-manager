[![NSP Status](https://nodesecurity.io/orgs/app/projects/34075a50-2c38-4a96-9b08-c70210b2abec/badge)](https://nodesecurity.io/orgs/app/projects/34075a50-2c38-4a96-9b08-c70210b2abec)
[![Build Status](https://travis-ci.org/kmanaseryan/error-manager.svg?branch=master)](https://travis-ci.org/kmanaseryan/error-manager)
# Overview
This [node module](https://www.npmjs.com/package/errorme) helps you to  create your own errors with your defined error codes and handle them within classes in a proper way.
# Features
* Creating errors objects instance of `Error` class from the self-defined error codes
* Throw the created error any time with informative error message/code and error stack
* Parse any error to HTTP error codes and messages
* Usage with express middleware 
* See custom and informative error messages in the client-side of the REST in development environment

# ECMAScript support
ES6 only

# Installation
`$ npm install errorme`

# API
Check the JSDoc [here](https://kmanaseryan.github.io/).

#Installation
`npm install errorme --save`

#Usage
You can add your custom errors or use the [default errors](https://github.com/kmanaseryan/error-manager/blob/master/lib/constants/default.json).
```javascript
//defining our custom errors
const errors = {
	"ValidationError": {
		"CODE": 100,
		"DEFAULT_MESSAGE": "The provided data is not valid",
		"HTTP_CODE": 400
	},
	"ServiceError": {
		"CODE": 101,
		"DEFAULT_MESSAGE": "Error happend related to the third party service",
		"HTTP_CODE": 500
	},
}
//overwriting defaults errors and requiring to show logs once an error created
let options = { overwrite: true, showLogs: true }
//requiring module
let errorme = require('errorme')(errors, options)

//getting error
let code = 100, customMessage = "The provided data is invalid"; 
let err = errorme.getError(code, customMessage) //custom message will be visible if process.env.DEV=true
console.log(err instanceof Error) //true
//parsing error to http
let httpErr = err.parseTo('http')
console.log(httpErr.code) //400
console.log(httpErr.definedCode) //100
console.log(httpErr.message) //"Bad request"

//create http error
let newHttpErr = errorme.getHttpError(100);
console.log(newHttpErr.code == httpErr.code) //true
console.log(newHttpErr.message == httpErr.message) //true

```

# Examples
To understand the real use case it will be better to see it with [async](https://www.npmjs.com/package/async) module, especially with [async/waterfall](http://caolan.github.io/async/docs.html#waterfall)

```javascript
let waterfall = require('async/waterfall');
let errorme = require('errorme')();

let someFunction = (params, callback)=>{
	waterfall([
		(_calllback)=>{
			//suppose here we are doing some database query
			//and it might fail
			let err;
			let data;
			if(Math.floor((Math.random() * 5)) == 0){
				//suppose here we've got  error
				err = errorme.getError(102, "Our database query unfortunately failed")
			}else{
				data = "Some data retrieved from database"
			} 
			_calllback(err, data) //err will be undefined if the if block is not executed
		},
		(data, _calllback)=>{
			//if this callback is being executed then it means the previous is not failed
			//and now we want to check our data which might not to meet to our criteria 
			let err;
			if(Math.floor((Math.random() * 5)) == 1){
				//data doesn't meet to our criteria
				//and we want to provide the corresponding error
				err = errorme.getError(100, "Data doesn't meet to our criteria")
				data = null;
			} 
			_calllback(err, data) //err will be undefined if the if block is not executed
		},
		(data, _calllback)=>{
			//soppose here we want to make a call to some external service which also can be failed
			let err;
			let dataOfExternalService;
			if(Math.floor((Math.random() * 5)) == 2){
				err = errorme.getError(101); //if don't pass message then the error message will be the default error message
			}else{
				dataOfExternalService = "Data from external service";
			} 
			_calllback(err, dataOfExternalService) //err will be undefined if the if block is not executed
		},
	], (error, data)=>{
		//here we can do our final operations 
		//and finally parse the error to http and send to the client
		// if(error)
		// 	error = error.parseTo('http');
		
		//we don't have anything to do in this final block then we could parse the error into http
		//in the above callbacks and as a callback we could just give the top most callback
		//lets say we don't want to parse to http. We just pass the pure error to the callback
		callback(error, data);		
	})
	
}

someFunction("some paramas", (error, data)=>{
	if(error){
		console.log('Error occured. Code: ' + error.code + ', message: ' + error.message);
	}
	if(data){
		console.log('Data: ' + data);
	}
});
```  
Using with [express](https://www.npmjs.com/package/express)

```javascript
let express = require('express');
let app = express();
let errorme = require('errorme')();

//creates middleware
errorme.middleware(app);
 
app.get('/', function (req, res) {
	let data = {
		foo: "Foo data"
	}
	let err;
	
	// uncoment below if you want to send http error message (data argument will be ignored)
	// err = errorme.getError(100);
	res.errormeSend(err, data);
});
 
app.listen(3000);
```

# Next features
* Will be ability to add other "error languages"
* Optimization for working with error codes defined by external service providers
    
# License
MIT        






















