var should = require('should')

var DEFAULT = require('../lib/constants/default');
var errors = DEFAULT.ERRORS;
var httpErrors = require('../lib/constants/http');

describe("testing errorme module intialization", function(){
	
	describe("adding new errors key/value based array to defined errors list", function(){
		var errorme;
		var extraErrors = {}, codes = [], errorNames = [];
		before(function(done){
			process.env.DEV = true;
			for(var i = 0; i < 10; i++){
				var code = Math.floor(Math.random() * 10000000);
				var errorName = "SomeErrorName" + code;
				codes.push(code); errorNames.push(errorName);
				extraErrors[errorName] = {
					"CODE": code,
					"DEFAULT_MESSAGE": "The default message of " + code + " code",
					"HTTP_CODE": 400
				}
					
			}
			errorme = require('../index.js')(extraErrors);
			done();
		});
		it("sould be able to get the default errors as needed", function(){
			for(var i in errors){
				var code = errors[i].CODE;
				var message = "Some error message";
				var error = errorme.getError(code, message);			
				error.message.should.equal(message);
				error.defaultMessage.should.equal(errors[i].DEFAULT_MESSAGE);
				error.code.should.equal(code);
				error.name.should.equal("Errorme" + i);
				var httpError = error.parseTo("http");			
				httpError.code.should.equal(errors[i].HTTP_CODE);
				httpError.message.should.equal(message);
				
				error = errorme.getError(code);
				error.message.should.not.equal(message);
				error.message.should.equal(errors[i].DEFAULT_MESSAGE);
				error.code.should.equal(code);
				error.name.should.equal("Errorme" + i);
				httpError = error.parseTo("http");			
				httpError.code.should.equal(errors[i].HTTP_CODE);
				httpError.message.should.equal(errors[i].DEFAULT_MESSAGE);
				
				process.env.DEV = false;
				httpError = error.parseTo("http");			
				httpError.code.should.equal(errors[i].HTTP_CODE);
				httpError.message.should.equal(httpErrors["ERROR_" + errors[i].HTTP_CODE].MESSAGE);
				process.env.DEV = true;
				
			}
		});	
		it("sould be able to get the added errors with the equivalent way and with appropriate properties", function(){
			for(var i in extraErrors){
				var code = extraErrors[i].CODE;
				var message = "Some error message";
				var error = errorme.getError(code, message);			
				error.message.should.equal(message);
				error.defaultMessage.should.equal(extraErrors[i].DEFAULT_MESSAGE);
				error.code.should.equal(code);
				error.name.should.equal("Errorme" + i);
				var httpError = error.parseTo("http");			
				httpError.code.should.equal(extraErrors[i].HTTP_CODE);
				httpError.message.should.equal(message);
				
				error = errorme.getError(code);
				error.message.should.not.equal(message);
				error.message.should.equal(extraErrors[i].DEFAULT_MESSAGE);
				error.code.should.equal(code);
				error.name.should.equal("Errorme" + i);
				httpError = error.parseTo("http");			
				httpError.code.should.equal(extraErrors[i].HTTP_CODE);
				httpError.message.should.equal(extraErrors[i].DEFAULT_MESSAGE);
				
				process.env.DEV = false;
				httpError = error.parseTo("http");			
				httpError.code.should.equal(extraErrors[i].HTTP_CODE);
				httpError.message.should.equal(httpErrors["ERROR_" + extraErrors[i].HTTP_CODE].MESSAGE);
				process.env.DEV = true;
			}
		});
		
		it("can't add errors if module is already initialized", function(){
			try {
				errorme = require('../index.js')([]);
			} catch (error) {
				error.name.should.equal("Error")
				error.message.should.equal("errorme is already initialized with errors argument");
			}
		});
		
		after(function(done){
			delete require.cache[require.resolve('../index.js')];
			delete require.cache[require.resolve('../lib/errorme')];
			done();
		})
	});
	
	describe("overwriting error list", function(){
		var errorme;
		var extraErrors = {}, codes = [], errorNames = [];
		before(function(done){
			process.env.DEV = true;
			for(var i = 0; i < 10; i++){
				var code = Math.floor(Math.random() * 10000000);
				var errorName = "SomeErrorName" + code;
				codes.push(code); errorNames.push(errorName);
				extraErrors[errorName] = {
					"CODE": code,
					"DEFAULT_MESSAGE": "The default message of " + code + " code",
					"HTTP_CODE": 400
				}
					
			}
			errorme = require('../index.js')(extraErrors, {overwrite: true});
			done();
		});
		it("sould not be able to get the default errors", function(){
			for(var i in errors){
				var code = errors[i].CODE;
				var message = "Some error message";
				try {
					var error = errorme.getError(code, message);			
				} catch (error) {
					error.name.should.equal("ReferenceError");
					error.message.should.equal("The error object can't be get for the provided error name/code")		
				}
			}
		});	
		it("sould be able to get the added errors with the equivalent way and with appropriate properties", function(){
			for(var i in extraErrors){
				var code = extraErrors[i].CODE;
				var message = "Some error message";
				var error = errorme.getError(code, message);			
				error.message.should.equal(message);
				error.defaultMessage.should.equal(extraErrors[i].DEFAULT_MESSAGE);
				error.code.should.equal(code);
				error.name.should.equal("Errorme" + i);
				var httpError = error.parseTo("http");			
				httpError.code.should.equal(extraErrors[i].HTTP_CODE);
				httpError.message.should.equal(message);
				
				error = errorme.getError(code);
				error.message.should.not.equal(message);
				error.message.should.equal(extraErrors[i].DEFAULT_MESSAGE);
				error.code.should.equal(code);
				error.name.should.equal("Errorme" + i);
				httpError = error.parseTo("http");			
				httpError.code.should.equal(extraErrors[i].HTTP_CODE);
				httpError.message.should.equal(extraErrors[i].DEFAULT_MESSAGE);
				
				process.env.DEV = false;
				httpError = error.parseTo("http");			
				httpError.code.should.equal(extraErrors[i].HTTP_CODE);
				httpError.message.should.equal(httpErrors["ERROR_" + extraErrors[i].HTTP_CODE].MESSAGE);
				process.env.DEV = true;
			}
		});
		
		it("can't add errors if module is already initialized", function(){
			try {
				errorme = require('../index.js')([]);
			} catch (error) {
				error.name.should.equal("Error")
				error.message.should.equal("errorme is already initialized with errors argument");
			}
		});
		
		after(function(done){
			delete require.cache[require.resolve('../index.js')];
			delete require.cache[require.resolve('../lib/errorme')];
			done();
		})
	});
	
	describe("adding new errors array to defined errors list", function(){
		var errorme;
		var extraErrors = [], codes = [], errorNames = [];
		before(function(done){
			process.env.DEV = true;
			for(var i = 0; i < 10; i++){
				var code = Math.floor(Math.random() * 10000000);
				var errorName = "SomeErrorName" + code;
				codes.push(code); errorNames.push(errorName);
				extraErrors.push({
					"NAME": errorName,
					"CODE": code,
					"DEFAULT_MESSAGE": "The default message of " + code + " code",
					"HTTP_CODE": 400
				});
					
			}
			errorme = require('../index.js')(extraErrors);
			done();
		});
		it("sould be able to get the default errors as needed", function(){
			for(var i in errors){
				var code = errors[i].CODE;
				var message = "Some error message";
				var error = errorme.getError(code, message);			
				error.message.should.equal(message);
				error.defaultMessage.should.equal(errors[i].DEFAULT_MESSAGE);
				error.code.should.equal(code);
				error.name.should.equal("Errorme" + i);
				var httpError = error.parseTo("http");			
				httpError.code.should.equal(errors[i].HTTP_CODE);
				httpError.message.should.equal(message);
				
				error = errorme.getError(code);
				error.message.should.not.equal(message);
				error.message.should.equal(errors[i].DEFAULT_MESSAGE);
				error.code.should.equal(code);
				error.name.should.equal("Errorme" + i);
				httpError = error.parseTo("http");			
				httpError.code.should.equal(errors[i].HTTP_CODE);
				httpError.message.should.equal(errors[i].DEFAULT_MESSAGE);
				
				process.env.DEV = false;
				httpError = error.parseTo("http");			
				httpError.code.should.equal(errors[i].HTTP_CODE);
				httpError.message.should.equal(httpErrors["ERROR_" + errors[i].HTTP_CODE].MESSAGE);
				process.env.DEV = true;
				
			}
		});	
		it("sould be able to get the added errors with the equivalent way and with appropriate properties", function(){
			for(var i in extraErrors){
				var code = extraErrors[i].CODE;
				var message = "Some error message";
				var error = errorme.getError(code, message);			
				error.message.should.equal(message);
				error.defaultMessage.should.equal(extraErrors[i].DEFAULT_MESSAGE);
				error.code.should.equal(code);
				error.name.should.equal("Errorme" + extraErrors[i].NAME);
				var httpError = error.parseTo("http");			
				httpError.code.should.equal(extraErrors[i].HTTP_CODE);
				httpError.message.should.equal(message);
				
				error = errorme.getError(code);
				error.message.should.not.equal(message);
				error.message.should.equal(extraErrors[i].DEFAULT_MESSAGE);
				error.code.should.equal(code);
				error.name.should.equal("Errorme" + extraErrors[i].NAME);
				httpError = error.parseTo("http");			
				httpError.code.should.equal(extraErrors[i].HTTP_CODE);
				httpError.message.should.equal(extraErrors[i].DEFAULT_MESSAGE);
				
				process.env.DEV = false;
				httpError = error.parseTo("http");			
				httpError.code.should.equal(extraErrors[i].HTTP_CODE);
				httpError.message.should.equal(httpErrors["ERROR_" + extraErrors[i].HTTP_CODE].MESSAGE);
				process.env.DEV = true;
			}
		});
		
		after(function(done){
			delete require.cache[require.resolve('../index.js')];
			delete require.cache[require.resolve('../lib/errorme')];
			done();
		})
	});
	
	describe("trying to add duplicate error names to defined errors list", function(){
		var errorme;
		var extraErrors = [], codes = [], errorNames = [];
		before(function(done){
			process.env.DEV = true;
			for(var i = 0; i < 10; i++){
				var code = Math.floor(Math.random() * 10000000);
				var errorName = "SomeErrorName" + code;
				codes.push(code); errorNames.push(errorName);
				extraErrors.push({
					"NAME": errorName,
					"CODE": code,
					"DEFAULT_MESSAGE": "The default message of " + code + " code",
					"HTTP_CODE": 400
				});
					
			}
			done();
		});
		
		
		it("sould return 'Duplicate provided error name' error", function(){
			var i = Math.floor((Math.random() * 10));
			var extraErrors1 = JSON.parse(JSON.stringify(extraErrors)); 			
			extraErrors1.push(JSON.parse(JSON.stringify(extraErrors1[i])));
			extraErrors1[extraErrors1.length - 1].CODE += "c"; 
			try {
				errorme = require('../index.js')(extraErrors1);
			} catch (error) {
				error.name.should.equal("DuplicateErrorValueError")
				error.message.should.equal("Duplicate provided error name");
			}
		});
		
		after(function(done){
			delete require.cache[require.resolve('../index.js')];
			delete require.cache[require.resolve('../lib/errorme')];
			done();
		})
	});
	
	describe("trying to add duplicate error codes to defined errors list", function(){
		var errorme;
		var extraErrors = [], codes = [], errorNames = [];
		before(function(done){
			process.env.DEV = true;
			for(var i = 0; i < 10; i++){
				var code = Math.floor(Math.random() * 10000000);
				var errorName = "SomeErrorName" + code;
				codes.push(code); errorNames.push(errorName);
				extraErrors.push({
					"NAME": errorName,
					"CODE": code,
					"DEFAULT_MESSAGE": "The default message of " + code + " code",
					"HTTP_CODE": 400
				});
					
			}
			done();
		});
		
		it("sould return 'Duplicate provided error code' error", function(){
			var i = Math.floor((Math.random() * 10));
			var extraErrors1 = JSON.parse(JSON.stringify(extraErrors)); 			
			extraErrors1.push(JSON.parse(JSON.stringify(extraErrors1[i])));
			extraErrors1[extraErrors1.length - 1].NAME += "n"; 
			try {
				errorme = require('../index.js')(extraErrors1);
			} catch (error) {
				error.name.should.equal("DuplicateErrorValueError")
				error.message.should.equal("Duplicate provided error code");
			}
		});
		after(function(done){
			delete require.cache[require.resolve('../index.js')];
			delete require.cache[require.resolve('../lib/errorme')];
			done();
		})
	});
	
	
})

describe("testing errorme module functions", function(){
	var errorme;
	before(function(done){
		errorme = require('../index.js')()
		done();
	})
	describe("testing getError() function by providing error code", function(){
			it("message property should equal to provided message if the message is provided", function(){
				for(var i in errors){
					var code = errors[i].CODE;
					var message = "Some error message";
					var error = errorme.getError(code, message);			
				
					error.message.should.equal(message);
				}
			});
			it("should have defaultMessage property which is not equal to provided message", function(){
				for(var i in errors){
					var code = errors[i].CODE;
					var message = "Some error message";
					var error = errorme.getError(code, message);			
					
					error.defaultMessage.should.equal(errors[i].DEFAULT_MESSAGE);
					error.defaultMessage.should.not.equal(message);
				}
			});
			it("code property should equal to provided error code", function(){
				for(var i in errors){
					var code = errors[i].CODE;
					var message = "Some error message";
					var error = errorme.getError(code, message);			
					
					error.code.should.equal(code);
				}
			});
			it("message property should equal to default message if the provided message deosn't exist", function(){
				for(var i in errors){
					var code = errors[i].CODE;
					var error = errorme.getError(code);			
					
					error.defaultMessage.should.equal(errors[i].DEFAULT_MESSAGE);
					error.defaultMessage.should.equal(error.message);
					error.code.should.equal(code);
				}
			});
			
	});
	
	describe("testing getError() function by providing error name", function(){
			it("message property should equal to provided message if the message is provided", function(){
				for(var i in errors){
					var name = i;
					var message = "Some error message";
					var error = errorme.getError(name, message);			
				
					error.message.should.equal(message);
				}
			});
			it("should have defaultMessage property which is not equal to provided message", function(){
				for(var i in errors){
					var name = i;
					var message = "Some error message";
					var error = errorme.getError(name, message);			
					
					error.defaultMessage.should.equal(errors[i].DEFAULT_MESSAGE);
					error.defaultMessage.should.not.equal(message);
				}
			});
			it("name property should equal to provided error code", function(){
				for(var i in errors){
					var name = i;
					var message = "Some error message";
					var error = errorme.getError(name, message);			
					error.name.should.equal("Errorme" + name);
				}
			});
			it("message property should equal to default message if the provided message deosn't exist", function(){
				for(var i in errors){
					var name = i;
					var error = errorme.getError(name);			
					
					error.defaultMessage.should.equal(errors[i].DEFAULT_MESSAGE);
					error.defaultMessage.should.equal(error.message);
					error.name.should.equal("Errorme" + name);
				}
			});
			
	});
	
	describe("testing parseTo() function of retrived error (parsing to http)", function(){
		it("error code should equal to corresponding http error code", function(){
			for(var i in errors){
				var code = errors[i].CODE;
				var httpCode = errors[i].HTTP_CODE;
				var message = "Some error messagge"
				var error = errorme.getError(code, message);
				var httpError = error.parseTo("http");			
				httpError.code.should.equal(httpCode);
			}
		});
		it("error messagge should equal to provided error message", function(){
			for(var i in errors){
				var code = errors[i].CODE;
				var message = "Some error messagge"
				var error = errorme.getError(code, message);
				var httpError = error.parseTo("http");			
				httpError.message.should.equal(message);
			}
		});
		it("error message should equal to default error message if the message argument is not provided", function(){
			for(var i in errors){
				var code = errors[i].CODE;
				var httpCode = errors[i].HTTP_CODE;
				var defMessage = errors[i].DEFAULT_MESSAGE;
				var error = errorme.getError(code);
				var httpError = error.parseTo("http");			
				httpError.message.should.equal(defMessage);
				httpError.code.should.equal(httpCode);
			}
		})
		
		it("if the DEV env variable is false then the http message should equal to standard http error message", function(){
			process.env.DEV = false;
			for(var i in errors){
				var code = errors[i].CODE;
				var httpCode = errors[i].HTTP_CODE;
				var message = "Some error messagge"
				var error = errorme.getError(code, message);
				var httpError = error.parseTo("http");
				var standardMessage = httpErrors["ERROR_" + httpCode].MESSAGE;			
				httpError.message.should.equal(standardMessage);
				httpError.message.should.not.equal(message);
				httpError.code.should.equal(httpCode);
			}
		})
	})
	
});