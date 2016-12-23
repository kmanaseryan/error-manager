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

let Validate = exports;

class MissingValueError extends Error{
	constructor(message, stack){
		super(message);
		this.name = "MissingValueError";
		Error.captureStackTrace(this, stack);
	}
}

class InvalidValueError extends Error{
	constructor(message, stack){
		super(message);
		this.name = "InvalidValueError";
		Error.captureStackTrace(this, stack);
	}
}

class DuplicateErrorValueError extends Error{
	constructor(message, stack){
		super(message);
		this.name = "DuplicateErrorValueError";
		Error.captureStackTrace(this, stack);
	}
}

Validate.error = (error, errors, stack)=>{
	if(!error.CODE)
		throw new MissingValueError("CODE property is required", stack);
	if(!error.DEFAULT_MESSAGE)
		throw new MissingValueError("DEFAULT_MESSAGE property is required", stack);
	if(!error.HTTP_CODE)
		throw new MissingValueError("HTTP_CODE property is required", stack);
	if(!error.NAME)
		throw new MissingValueError("NAME property is required", stack);
	if(typeof error.NAME !== "string")
		throw new InvalidValueError("Error name should be string.", stack);
	for(let key in errors){
		let _error = errors[key];
		let name = key;
		if(name == error.NAME)
			throw new DuplicateErrorValueError("Duplicate provided error name", stack);
		if(_error.CODE == error.CODE)
			throw new DuplicateErrorValueError("Duplicate provided error code", stack);
	}
	return error;
} 
