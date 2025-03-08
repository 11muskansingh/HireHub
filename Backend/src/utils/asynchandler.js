const asynchandler = (fn) => {
  return (req, res, next) => {
    // console.log("first");
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export { asynchandler };
