const mongoose = require("mongoose");

module.exports = () => {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("✅ Banco de Dados conectado"))
        .catch(err => console.log("❌ Erro no Banco de Dados:", err));
};