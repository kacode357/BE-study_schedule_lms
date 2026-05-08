class ApiResponse {
  /**
   * Format for a successful API response
   * @param {any} data - The data payload to return
   * @returns {Object} { success: true, data }
   */
  static success(data) {
    return {
      success: true,
      data: data
    };
  }

  /**
   * Format for a single logic/server error
   * @param {string} message - The error message
   * @returns {Object} { success: false, message, errors: [] }
   */
  static errorSingle(message) {
    return {
      success: false,
      message: message,
      errors: []
    };
  }

  /**
   * Format for multiple validation errors
   * @param {Array<{field: string, message: string}>} errors - List of field errors
   * @returns {Object} { success: false, message: null, errors }
   */
  static errorMulti(errors) {
    return {
      success: false,
      message: null,
      errors: errors
    };
  }
}

module.exports = ApiResponse;
