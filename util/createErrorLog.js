function setError(res, error, err) {
  console.error(error);
  return res.json({
    success: false,
    error: error,
    err: err
  });
}

module.exports = setError;
