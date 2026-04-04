const mongoose = require("mongoose");

module.exports = () => {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("✅ Mongo conectado"))
        .catch(err => console.log("❌ Erro Mongo:", err));
};