const mongoose = require('mongoose');

exports.connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((data) => {
      console.log(`DB CONNECTED: ${data.connection.host}`);
    })
    .catch((err) => console.log(err));
};
