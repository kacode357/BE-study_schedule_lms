class ApiResponse {
  /**
   * @param {any} data
   * @param {string|null} message - optional success message
   */
  static success(data, message = null) {
    return {
      success: true,
      message,
      data,
    };
  }

  /**
   * @param {string} message
   */
  static errorSingle(message) {
    return {
      success: false,
      message,
      errors: [],
    };
  }

  /**
   * @param {Array<{field: string, message: string}>} errors
   */
  static errorMulti(errors) {
    return {
      success: false,
      message: null,
      errors,
    };
  }
}

module.exports = ApiResponse;
