export default function logger() {
  process.on("uncaughtException", (ex) => {
    console.log(ex.message, ex);
    process.exit(1);
  });


  process.on("unhandledRejection", (ex) => {
    throw ex;
    process.exit(1);
  });


  if (!process.env.JWT_SECRET) {
    console.log('FATAL ERROR...');
    process.exit(1);
  }
}