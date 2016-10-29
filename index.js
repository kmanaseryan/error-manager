'use strict';
const CONFIG = require('./config');
const HTTP_ERROR_CODE_CONSTANTS = require('./config/http');

const ERRORS = CONFIG.ERRORS;
const ERROR_LANGUAGES = CONFIG.ERROR_LANGUAGES;

var _ = require('lodash');

const errorme = {};

/**
 * @type function
 * @access private
 * @param {string} name - The name of the key of [ERRORS] varant object 
 * @description Returns error object by the key name in [ERRORS] varant object 
 * @returns {object}
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
var _getErrorByName = (name)=>{
	let error =  ERRORS[name];
	if(!error){
		let e = new ReferenceError("The error object can't be get for the provided error name");
		throw e;
	}
	return error;
}

/**
 * @type function
 * @access private
 * @param {number} code - The error code name inside [ERRORS] varant object 
 * @description Returns error object by the code name inside [ERRORS] varant object 
 * @returns {object}
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
var _getErrorByCode = (code)=>{
	let error;
	
	_(ERRORS).forEach((err)=>{
		if(err.CODE == code){
			error = err;
		}
	})
	if(!error){
		let e = new ReferenceError("The error object can't be get for the provided error code");
		throw e;
	}
	return error;
}

/**
 * @type function
 * @description Creats HTTP error
 * @returns {Object} error information with HTTP error message and code
 * @param {Number} code: http error status code 
 * @param {String} message: Information about the error
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
var _makeHttpError =  (code, message) => {
	let httpCode = HTTP_ERROR_CODE_CONSTANTS["ERROR_" + code];
	let error;
	try {
		code = httpCode.CODE;
		error = {
			code: code,
			message: message || httpCode.MESSAGE
		}
		if(!_options.showCustomErrMessages){
			error.message = httpCode.MESSAGE;
		}
	} catch (error) {
		let err = new RangeError("The provided [code] http code:" + JSON.stringify(code)
			+ " is not valid. Please check the http config file under the /config/http folder.");
		throw err;
	}
	return error;
}

/**
 * @type function
 * @access private
 * @param {object} error - Errors type of object containing information about error
 * @param {string} lang - The error language in which it is required to parse
 * @description Parse the provided Errors type of object into provided type (ex. http) specific object
 * @returns {object}
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
var _parseErrorTo = (error, lang)=>{
	lang = lang.toLowerCase();
	let isValidLang = false;
	_(ERROR_LANGUAGES).forEach((LANG)=>{
		if(LANG == lang){
			isValidLang = true;
		}
	})
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
 * @access public
 * @param {string} key - The key of error object or the error code inside [ERRORS] varant object 
 * @param {string} message - An optional parameter for describing error
 * @description Returns error object by the key name or the error code in [ERRORS] varant object
 * @returns {object}
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
errorme.getError = (key, message)=>{
	let _key = parseInt(key);
	let error;
	console.log(_key)
	if(!_.isNaN(_key)) 
		error = _getErrorByCode(_key);
	else
		error = _getErrorByName(key);
	error = new Errors(error, message);
	return error;
}

/**
 * @type function
 * @access public
 * @param {string} key - The key of error object or the error code inside [ERRORS] varant object 
 * @param {string} message - An optional parameter for describing error
 * @description Returns http specific error object by the key name or the error code in [ERRORS] varant object
 * @returns {object}
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
errorme.getHttpError = (key, message)=>{
	return errorme.getError(key, message).parseTo('http');
}

/**
 * @class
 * @classdesc - Errors class creates error object which could be parse from one defined type to the another defined type
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
const Errors = function(error, message){
	var self = this;
	this.code = error.CODE;
	this.message = message || error.DEFAULT_MESSAGE;
	this.defaultMessage = error.DEFAULT_MESSAGE;
	this.httpCode = error.HTTP_CODE;
	this.parseTo = (lang)=>{
		return _parseErrorTo(self, lang);
	}
	return this;
}

module.exports = errorme;