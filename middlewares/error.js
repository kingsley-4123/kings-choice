export default function errorHandler(err, req, res, next) {
  console.log(err.message, err);

  res.status(500).json({ message: "Something Failed..." });
}