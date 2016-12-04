# Overview
This [node module](https://www.npmjs.com/package/errorme) helps you to  create your own errors with your defined error codes and handle them differently within your classes. Suppose we have created Archive Manager module which does database operations and is able to pass errors in callbacks. You can define your own error codes as you may have done before by doing `new Error(<error message>, <error code>)` etc.  However the difference here is that you can parse that error object into HTTP error message with appropriate HTTP error by integrating it with your RESTful service.

# Features
* Creating errors objects instance of `Error` class from the self-defined error codes
* Throw the created error any time with informative error message/code and error stack
* Parse any error to HTTP error codes and messages
* See custom and informative error messages in the client-side of the REST in development environment

# ECMAScript support
ES6 only

# Installation
`$ npm install errorme`

# How to use?
Check the docs [here](https://kmanaseryan.github.io/).

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


# Next features
* Will be ability to add other "error languages"
* Optimization for working with error codes defined by external service providers
    
# License
MIT        






















