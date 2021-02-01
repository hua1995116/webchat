module.exports = (req, res, next) => {
  res.success = ({ data = {}, msg = "" }) => {
    res.json({
      errno: 0,
      msg,
      data,
    });
  };
  res.error = ({ data = {}, msg = "" }) => {
    res.json({
      errno: 1,
      msg,
      data,
    });
  };
  next();
};
