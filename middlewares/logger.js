//@desc   custom looger

const logger = (req, res, next) => {
  console.log(
    `From Custom logger: ${req.method} ${req.protocol}:// ${req.get('host')}${
      req.originalUrl
    }`
  );
  next();
};
module.exports = logger;
