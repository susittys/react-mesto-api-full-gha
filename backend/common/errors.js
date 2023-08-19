export default () => {
  const BadRequest = (message) => ({
    statusCode: 400,
    message,
  });

  const Unauthorized = (message) => ({
    statusCode: 401,
    message,
  });

  const Forbidden = (message) => ({
    statusCode: 403,
    message,
  });

  const NotFound = (message) => ({
    statusCode: 404,
    message,
  });

  const existEmail = (message) => ({
    statusCode: 409,
    message,
  });

  return {
    BadRequest,
    Unauthorized,
    Forbidden,
    NotFound,
    existEmail,
  };
};
