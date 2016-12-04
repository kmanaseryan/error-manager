'use strict';
/**
 * @license
 * MIT License
 *
 * Copyright (c) 2016 [Karlen Manaseryan]
 *	
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *	
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *	
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * IABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * */


/**
 * Object which describes an HTTP error information. 
 * @typedef {Object} httpError
 * @property {number} code - HTTP error code
 * @property {number} definedCode - defined error code
 * @property {string} message - Error inormation
 */


const DEFAULT = require('./constants/default.json');
const HTTP_ERROR_CODES = require('./constants/http.json');
const ERROR_LANGUAGES = DEFAULT.ERROR_LANGUAGES;

let _errors = DEFAULT.ERRORS;
let initialized = false;
let showLogs = false;

var v = require('./internal/validate');



var _getErrorByName = (name)=>{
	let error =  _errors[name];
	if(!error) return null;
	error.name = name;
	return error;
}

var _getErrorByCode = (code)=>{
	let error;
	
	for(let key in _errors){
		let err = _errors[key];
		if(err.CODE == code){
			error = err;
			error.name = key;
		}
	}
	if(!error) return null;
	
	return error;
}

var _makeHttpError =  (code, message) => {
	let httpCode = HTTP_ERROR_CODES["ERROR_" + code];
	let error;
	try {
		code = httpCode.CODE;
		error = {
			code: code,
			message: httpCode.MESSAGE
		}
		if(process.env.DEV && JSON.parse(process.env.DEV)){
			error.message = message || httpCode.MESSAGE;
		}
	} catch (error) {
		let err = new RangeError("The provided [code] http code: " + JSON.stringify(code)
			+ " is not valid. Please check the http config file under the /config/http folder.");
		throw err;
	}
	return error;
}

var _parseErrorTo = (error, lang)=>{
	lang = lang.toLowerCase();
	let isValidLang = false;
	for(let key in ERROR_LANGUAGES){
		let LANG = ERROR_LANGUAGES[key];
		if(LANG == lang){
			isValidLang = true;
		}
	}
	if(!isValidLang){
		let e = new ReferenceError("The error object can't be get for the provided error language");
		throw e;
	}
	if(lang == 'http'){
		let httpError = _makeHttpError(error.httpCode, error.message);
		httpError.definedCode = error.code;
		return httpError;
	}
}


/**
 * @class 
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
class Errorme {
	constructor(app){
		this.app = app;
	}
	
	/**
	* memberof Errorme#
	* @param {string} key - The name (key) of error object or the error code inside [ERRORS] object 
	* @param {string} message - An optional parameter for describing the error
	* @description Returns error object based on the defined errors list
	* @returns {ErrormeError}
	* @author Karlen Manaseryan <kmanaseryan@gmail.com>
	*/
	getError(key, message){
		let error;
		error = _getErrorByCode(key);
		if(!error)
			error = _getErrorByName(key);
		if(!error){
			let e = new ReferenceError("The error object can't be get for the provided error name/code");
			Error.captureStackTrace(e, this.getError);
			throw e;
		}
		error = new ErrormeError(error, this.getError, message);
		if(showLogs)
			console.warn("[errorme] Error code: " + error.code + ", Message: " + (error.message || error.defaultMessage))
		return error;
	}
	/**
	* memberof Errorme#
	* @param {string} key - The name (key) of error object or the error code inside [ERRORS] object 
	* @param {string} message - An optional parameter for describing the error
	* @description Returns http specific error object by the key name or the error code in [ERRORS] varant object
	* @returns {httpError}
	* @author Karlen Manaseryan <kmanaseryan@gmail.com>
	*/
	getHttpError(key, message){
		return this.getError(key, message).parseTo('http');
	}
	
	/**
	* memberof Errorme#
	* @param {function} app - express middleware app
	* @description Assign a function to errormeSend property of response object.
	* The function errormeSend() is the following: errormeSend(error: ErrormeError, data: Object), if error exist then send the appropriate http error, 
	* otherwhise sends success with the provided data  
	* @author Karlen Manaseryan <kmanaseryan@gmail.com>
	*/
	middleware(app){
		if(!(app && typeof app.use == 'function')){
			let e = Error("App argument should be valid express app");
			Error.captureStackTrace(e, this.middleware);
			throw e;
		}
		app.use((req, res)=>{
			res.errormeSend = (err, data)=>{
				if(err && !(err instanceof ErrormeError)){
					let e = Error("error argument is not instance of ErrormeError class");
					Error.captureStackTrace(e, res.errormeSend);
					throw e;
				}
				if(err){
					err = err.parseTo('http');
					let response = {
						error:{
							code: err.definedCode,
							message: err.message
						},
						status: err.code,
						data: null
					}
					res.status(err.code);
					res.send(JSON.stringify(response));	
				}else{
					let response = {
						error: null,
						data: data
					}
					res.status(200);
					res.send(JSON.stringify(response));
				}
			}
		});
	}
}


/**
 * @class
 * @classdesc - Class inherited from Error class. 
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
class ErrormeError extends Error{
	constructor(error, stack, message){
		super(message || error.DEFAULT_MESSAGE);
		this.name = "Errorme" + error.name;
		this.code = error.CODE;
		this.defaultMessage = error.DEFAULT_MESSAGE;
		this.httpCode = error.HTTP_CODE;
		Error.captureStackTrace(this, stack);
	}
	
	/**
	* memberof ErrormeError#
	* @param {string} lang - The error language in which it is required to parse
	* @description Parse the provided error into provided type (ex. http) specific object
	* @returns {httpError}
	* @author Karlen Manaseryan <kmanaseryan@gmail.com>
	*/
	parseTo(lang){
		return _parseErrorTo(this, lang);
	}
}

/**
 * errorme module.
 * @module errorme
 */

/**
 * Requiring module. Extra errors can be added only once i.e. at the first require(). 
 * Adding after initialization i.e. during next time require() will throw error.
 *
 * @param {Object|array} errorsToBeAdded - Either array or key/value array which will have information
 * of new errors. All errors should have unique name and code. The style of objects should be the same as in /constants/default.json file.
 * If the argument is array then every object of array should have extra "NAME" property which should be unique.
 * @param {Object} option - Optional argument
 * @param {boolean} option.overwrite - Whether to overwrite default defined errors list with the new provided ones or not.
 * @param {boolean} option.showLogs - Whether to show logs or not. Logs show error message and error code once the getError() function being called
 * @return {errorme}
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
module.exports = (errorsToBeAdded, option)=>{
	if(!initialized){
		let newErrors = _errors;
		option = option || {};
		showLogs = option.showLogs;
		if(option.overwrite){
			newErrors = [];
		}
		for(let key in errorsToBeAdded){
			let error = errorsToBeAdded[key];
			if(isNaN(parseInt(key)))
				error.NAME = key;
			error = v.error(error, newErrors, module.exports);
			let toBeAddedErrorName = error.NAME;
			error = {
				CODE: error.CODE,
				DEFAULT_MESSAGE: error.DEFAULT_MESSAGE,
				HTTP_CODE: error.HTTP_CODE
			}
			newErrors[toBeAddedErrorName] = error;
		}
		_errors = newErrors;
	}else if(errorsToBeAdded){
		throw new Error("errorme is already initialized with errors argument");
	}
	initialized = true;	
	return new Errorme();
};