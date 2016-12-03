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
 * @property {string} message - Error inormation
 */


/** @constant
    @type {Object}
*/
const DEFAULT = require('./constants/default.json');
/** @constant
    @type {Object}
	@global
*/
const HTTP_ERROR_CODES = require('./constants/http.json');

/** @constant
	@type {array}
    @global
*/
const ERROR_LANGUAGES = DEFAULT.ERROR_LANGUAGES;

/** 
 * @global 
 * Defined errors 
 **/
let _errors = DEFAULT.ERRORS;
/** @global */
let initialized = false;
/** @global */
let showLogs = false;

var v = require('./internal/validate');


/** @namespace */
const errorme = {};

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
		return _makeHttpError(error.httpCode, error.message);
	}
}

/**
 * @type function
 * @param {string} key - The name (key) of error object or the error code inside [ERRORS] object 
 * @param {string} message - An optional parameter for describing the error
 * @description Returns error object based on the defined errors list
 * @returns {Errorme}
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
errorme.getError = (key, message)=>{
	let error;
	error = _getErrorByCode(key);
	if(!error)
		error = _getErrorByName(key);
	if(!error){
		let e = new ReferenceError("The error object can't be get for the provided error name/code");
		Error.captureStackTrace(e, errorme.getError);
		throw e;
	}
	error = new Errorme(error, errorme.getError, message);
	if(showLogs)
		console.warn("[errorme] Error code: " + error.code + ", Message: " + (error.message || error.defaultMessage))
	return error;
}

/**
 * @type function
 * @param {string} key - The name (key) of error object or the error code inside [ERRORS] object 
 * @param {string} message - An optional parameter for describing the error
 * @description Returns http specific error object by the key name or the error code in [ERRORS] varant object
 * @returns {httpError}
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
errorme.getHttpError = (key, message)=>{
	return errorme.getError(key, message).parseTo('http');
}

/**
 * @class
 * @classdesc - Errorme class creates error object which could be parse from one defined type to the another defined type
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
class Errorme extends Error{
	constructor(error, stack, message){
		super(message || error.DEFAULT_MESSAGE);
		this.name = "Errorme" + error.name;
		this.code = error.CODE;
		this.defaultMessage = error.DEFAULT_MESSAGE;
		this.httpCode = error.HTTP_CODE;
		Error.captureStackTrace(this, stack);
	}
	
	/**
	* memberof Errorme#
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
	return errorme;
};