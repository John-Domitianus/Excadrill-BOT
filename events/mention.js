const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = (client, context) => {
    client.on("messageCreate", async (message) => {
        if (!context.dadosCarregados || message.author.bot) return;

        const botMention = `<@${client.user.id}>`;
        const botNicknameMention = `<@!${client.user.id}>`;

        if (message.content !== botMention && message.content !== botNicknameMention) return;

        const embed = new EmbedBuilder()
            .setTitle("Clã Buraco - Excadrill")
            .setDescription(
                "Clique nos botões abaixo para executar os comandos desejados.\n\n" +
                "• `Admin` — Painel de administração (para administradores)\n" +
                "• `Eventos` — Painel exclusivo de Eventos\n" +
                "• `Torneio` — Inscrições do Torneio atual\n" +
                "• `Nick` — Altere seu nickname para o mesmo do jogo (com a tag do clã)"
            )
            .setColor(0x00FFFF);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("simulate_admin")
                .setLabel("Admin")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("simulate_eventos")
                .setLabel("Eventos")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("simulate_torneio")
                .setLabel("Torneio")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("simulate_nick")
                .setLabel("Nick")
                .setStyle(ButtonStyle.Secondary),
        );

        await message.reply({ embeds: [embed], components: [row] });
    });

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isButton() || !context.dadosCarregados) return;

        let commandText;
        switch (interaction.customId) {
            case "simulate_admin": commandText = "!admin"; break;
            case "simulate_eventos": commandText = "!eventos"; break;
            case "simulate_torneio": commandText = "!torneio"; break;
            case "simulate_nick": commandText = "!nick"; break;
        }

        if (!commandText) return;

        // Cria fakeMessage simulando message
        const fakeMessage = {
            content: commandText,
            author: interaction.user,
            member: interaction.member,
            reply: (opts) => interaction.channel.send(opts) // envia no canal, sem tocar na interação
        };

        try {
            // Chama o comando como se tivesse sido digitado
            require(`../commands/${commandText.slice(1)}`)(fakeMessage, context);
        } catch (err) {
            console.error("Erro ao executar comando simulado:", err);
        }
    });
};