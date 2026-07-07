const { EmbedBuilder } = require("discord.js");

module.exports = (client, context) => {

    client.on("messageCreate", async (message) => {
        if (!context.dadosCarregados || message.author.bot) return;

        const content = message.content.trim();
        const lower = content.toLowerCase();

        // ===== BLOQUEIO DE CANAL (mantido, melhorado) =====
        const comandoNome = lower.startsWith("!")
            ? lower.slice(1).split(" ")[0]
            : null;

        if (
            comandoNome &&
            context.comandos?.[comandoNome] &&
            context.getCanalFilaCompleta &&
            context.getCanalFilaCompleta() &&
            message.channel.id !== context.getCanalFilaCompleta()
        ) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xED4245)
                        .setTitle("❌ Canal incorreto")
                        .setDescription(`Use comandos em <#${context.getCanalFilaCompleta()}>`)
                ]
            });
        }

        // ===== CONTEXTO LOCAL (SEM DUPLICAÇÃO) =====
        const localContext = {
            ...context,
            hoje: () => {
                const d = new Date();
                return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
            },
            pegarHorario: () => {
                const agora = new Date();
                return `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
            }
        };

        try {

            // =========================
            // 1. FLUXO DE NICK (mantido separado porque NÃO é comando fixo)
            // =========================
            if (
                context.fluxoNick[message.author.id]
            ) {
                const nickCmd = context.comandos?.nick;
                if (nickCmd) {
                    await nickCmd(message, localContext);
                }
                return;
            }

            // =========================
            // 2. COMANDOS DINÂMICOS (!)
            // =========================
            if (lower.startsWith("!")) {

                const args = lower.slice(1).split(" ");
                const cmdName = args[0];

                const cmd = context.comandos?.[cmdName];

                if (!cmd) return;

                await cmd(message, localContext);
            }

        } catch (err) {
            console.error("❌ Erro no messageCreate:", err);
        }
    });
};