const eventos = require("./handlers/eventos");
const torneio = require("./handlers/torneio");
const selects = require("./handlers/selects");
const admin = require("./handlers/adminButtons");

module.exports = (client, context) => {

    client.on("interactionCreate", async (interaction) => {

        if (!context.dadosCarregados) return;

        // ================= BUTTONS =================
        if (interaction.isButton()) {

            const handledAdmin = await admin(interaction, context);
            if (handledAdmin) return;

            const handledEventos = await eventos(interaction, context);
            if (handledEventos) return;

            const handledTorneio = await torneio(interaction, context);
            if (handledTorneio) return;
        }

        // ================= SELECT MENUS =================
        if (interaction.isChannelSelectMenu() || interaction.isStringSelectMenu()) {
            const handledSelects = await selects(interaction, context);
            if (handledSelects) return;
        }

    });

};