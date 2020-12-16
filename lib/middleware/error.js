// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  let status = err.status || 500;

  res.status(status);

  if(err.message.includes('No recipe')) {
    status = 404;
  }

  console.log(status);

  res.send({
    status,
    message: err.message
  });
};
