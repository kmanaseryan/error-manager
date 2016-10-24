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
		"VALIDATION_ERROR": {
			"CODE": 103,
			"DEFAULT_MESSAGE": "The provided data is not valid",
			"HTTP_CODE": 400
		},
		"USER_NOT_FOUND": {
			"CODE": 104,
			"DEFAULT_MESSAGE": "User not found in Database",
			"HTTP_CODE": 404
		},
		"AUTH_ERROR": {
			"CODE": 105,
			"DEFAULT_MESSAGE": "Authentication is required",
			"HTTP_CODE": 401
		},
		"SYSTEM_ERROR": {
			"CODE": 106,
			"DEFAULT_MESSAGE": "Internal system error occured",
			"HTTP_CODE": 500
		},
		"CONNECTION_ERROR": {
			"CODE": 107,
			"DEFAULT_MESSAGE": "Connection to provided system failed",
			"HTTP_CODE": 500
		},
		"INIFINIT_LOOP": {
			"CODE": 108,
			"DEFAULT_MESSAGE": "Amount of itereation exceeded the limit",
			"HTTP_CODE": 500
		},
		"WRONG_DATA_TYPE": {
			"CODE": 109,
			"DEFAULT_MESSAGE": "The provided data does not have appropriate data type",
			"HTTP_CODE": 400
		},
		"RANGE_ERROR": {
			"CODE": 110,
			"DEFAULT_MESSAGE": "Range error occured",
			"HTTP_CODE": 400
		},
		"MISSING_VALUES": {
			"CODE": 111,
			"DEFAULT_MESSAGE": "Some required values are missing",
			"HTTP_CODE": 400
		},
		"DATA_NOT_FOUND": {
			"CODE": 112,
			"DEFAULT_MESSAGE": "Data is not found",
			"HTTP_CODE": 404
		},
		"MEMCACHED_ERROR": {
			"CODE": 113,
			"DEFAULT_MESSAGE": "Memory cache error",
			"HTTP_CODE": 500
		},
		"ACCESS_DENIED": {
			"CODE": 114,
			"DEFAULT_MESSAGE": "Access denied for specified operation",
			"HTTP_CODE": 401
		}
	}
}