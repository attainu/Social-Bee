//@desc   custom looger
require("colors");
const logger = (req, res, next) => {
  console.log(
    `From Custom logger: ${req.method} ${req.protocol}:// ${req.get("host")}${
      req.originalUrl
    }`.cyan.underline
  );
  next();
};
module.exports = logger;
