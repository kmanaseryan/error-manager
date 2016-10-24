'use strict';
const CONFIG = require('./config');
const ERRORS = CONFIG.ERRORS;
const ERROR_LANGUAGES = CONFIG.ERROR_LANGUAGES;

var _ = require('lodash');

var JsonResponse = require('response-http-json')

const ErrorManager = {};

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
		return JsonResponse.makeError(error.httpCode, error.message);
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
ErrorManager.getError = (key, message)=>{
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
ErrorManager.getHttpError = (key, message)=>{
	return ErrorManager.getError(key, message).parseTo('http');
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

module.exports = ErrorManager;