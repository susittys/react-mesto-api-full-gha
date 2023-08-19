// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
  const { message = 'На сервере произошла ошибка' } = err;
  const { statusCode = 500 } = err;

  res.status(statusCode).send({ message });
};
