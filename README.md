# Overview
This [node module](https://www.npmjs.com/package/errorme) helps you to  create your own errors with your defined error codes and handle them differently within your classes. Suppouse we have created Archieve Manager module which does database operations and able to pass errors in callbacks. You can define your own error codes as you may have done before by doing `new Error(<error message>, <error code>)` etc.  However the difference here is that you can parse that error object into HTTP error message with appropriate error HTTP error codes by integrating it with your RESTful service.




# Features
* Creating error objects with self-defined error codes
* Parsing them to HTTP error codes and messages
* Abality to  add custom error messages in development einvironement and see them in the client-side of the RESful service




# Installation
`$ npm install errorme`
# Configuration
First you need to check the configuration `index.js` file under the `/config` folder. Which is the following:
```javascript
module.exports = {
	"ERROR_LANGUAGES": ['http', 'Something else'],
	"ERRORS": {
		"DOES_NOT_MATCH": {
			"CODE": 100,
			"DEFAULT_MESSAGE": "There is no match for provided parameters",
			"HTTP_CODE": 404
		},
		"SERVICE_ERROR": {
			"CODE": 101,
			"DEFAULT_MESSAGE": "Error happend related to the third party service",
			"HTTP_CODE": 500
		},
		"DATABASE_ERROR": {
			"CODE": 102,
			"DEFAULT_MESSAGE": "Database query failed",
			"HTTP_CODE": 500
		},
		...
		"ACCESS_DENIED": {
			"CODE": 114,
			"DEFAULT_MESSAGE": "Access denied for specified operation",
			"HTTP_CODE": 401
		}
	}
}




```
Here is provided most common errors with specified error names (which are the keys of `ERROR` property), codes and default error messages (this messages are visible to the client i.e. if you send it through HTTP, then the client will see the specified value of `DEFAULT_MESSAGE` and `HTTP_CODE`).




You can change the values of `CODE`, `DEFAULT_MESSAGE` and `HTTP_CODE` with your desired error codes and messages. For the given value of `CODE` you match with appropriate `HTTP_CODE` for parsing the errors into HTTP protocol defined errors.




# errorme API
`var errorme = require("errorme");`

**.getError(error_key, error_message)**

* *error_key* - Either error code or error name defined in `config/index.js` file
* *error_message* - An error message which will be visible for the client if the process einvironement variable `DEV` is `true`
    
   Returns object which has the following methods and properties:
    
    **Properties**
    
    * `message`
    
        Equals to *error_message* if provided, otherwise to `DEFAULT_MESSAGE` in `config/index.js` file
    * `defaultMessage`
    
        Equals to `DEFAULT_MESSAGE` in `config/index.js` file
    * `httpCode`
    
        Equals to corresponding `HTTP_CODE` in `config/index.js` file
    
    **Methods**
    * `parseTo(error_language)`
    
        Parse the error into provided "error language"
    
    **Example:**

    `errorme.getError(102, "User document is not found for the specified id");`
    
    Here the error code is 102. For geting error by error name:
    `errorme.getError("DATABASE_ERROR", "User document is not found for the specified id");`

    
**.getHttpError(error_key, error_message)**
* *error_key* - Either error code or error name defined in `config/index.js` file. **Note that this is not HTTP error code. It is the self-defined error code which is matched with appropriate HTTP error code**
* *error_message* - An error message which will be visible for the client if the process einvironement variable `DEV` is `true`

    Returns object. The result of this function can be acheived by calling **.getError(error_key, error_message)** function and then call the **.parseTo('http')** function of returned object (*see below API*). 
    
# returned error object API
So you have got the created your error by calling **.getError()** function. Below is yet the only function of error object.


**.parseTo(error_language)** - *Parse the error into desired "error language" such as HTTP protocol errors*
* *error_language* - Should be equal to one of the values of `ERROR_LANGUAGES` array (check the `config/index.js` file) 

    You can add your own "error languages" in `config/index.js` file. By default `"HTTP"` - "http error language" is added as HTTP protocol errors
    
    If the *error_language* is equal to `"HTTP"` then the response has the following properties:
        
    * `code`
    
        HTTP protocol error code should be number
    * `message`
        
        Error message which equals to custom error message previouly added when created the object or equals to `DEFAULT_MESSAGE`
    
    **Example**
    
    ```javascript
    var err = errorme.getError(102, "User document is not found for the specified id");
    var httpError = err.parseTo("http");
    console.log(httpError.code);
    //500
    console.log(httpError.code);
    //"User document is not found for the specified id" - if DEV=true
    //"Database query failed" - otherwhise
    
    ```    
# Next features
* Will be ability to add other "error languages"
* Optimiziation for working with error codes defined by external service providers
    
        









