export function errorHandler(error, req, res, next) {
  console.error(error);
  res.status(500).json({ message: 'The server could not process this request.' });
}
