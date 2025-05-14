class ExpressError extends Error {
    constructor(statusCode, message) {
        super(); // Call the parent class (Error) constructor
        this.statusCode = statusCode;
        this.message = message;
    }
}
module.exports = ExpressError;