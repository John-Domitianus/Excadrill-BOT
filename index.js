global.rootDir = __dirname;

const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const dataManager = require("./services/dataManager");

// ===== CLIENT =====
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ===== BANCO =====
require("./database/connect")();

// ===== CONTEXTO =====
const context = {
    client,
    ...dataManager,
    dadosCarregados: false
};

// ===== FUNÇÃO GENÉRICA DE LOADER =====
function carregarPasta(nomePasta, callback) {
    const pastaPath = path.join(__dirname, nomePasta);

    console.log(`\n📂 Carregando ${nomePasta}...\n`);

    const arquivos = fs.readdirSync(pastaPath).filter(f => f.endsWith(".js"));

    for (const file of arquivos) {
        const fullPath = path.join(pastaPath, file);

        try {
            const modulo = require(fullPath);

            console.log(`✅ ${nomePasta}/${file}`);

            if (callback) callback(modulo, file);

        } catch (err) {
            console.log(`❌ ${nomePasta}/${file} -> ${err.message}`);
        }
    }
}

// ===== LOADERS =====

// comandos
context.comandos = {};
carregarPasta("commands", (mod, file) => {
    const nome = file.replace(".js", "");
    context.comandos[nome] = mod;
});

// eventos
carregarPasta("events", (mod) => {
    mod(client, context);
});

// interactions
carregarPasta("interactions", (mod) => {
    mod(client, context);
});

// ===== INIT =====
(async () => {
    try {
        await client.login(process.env.TOKEN);

        await dataManager.carregarDadosMongo();
        context.dadosCarregados = true;

        console.log("\n🚀 MÓDULOS CARREGADOS COM SUCESSO\n");
        console.log("\n🚀 BOT DA GUILDA ONLINE!\n");

    } catch (err) {
        console.error("❌ Erro ao iniciar:", err);
    }
})();