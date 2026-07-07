const { embedErro, embedSucesso } = require("../../utils/embeds");
const { salvarDados } = require("../../services/dataManager");

module.exports = async (interaction, context) => {

    // só botões admin (ajuste os IDs conforme seu sistema real)
    const id = interaction.customId;

    const isAdminButton =
        id === "select_fila" ||
        id === "select_ban";

    if (!isAdminButton) return false;

    const erro = (msg) =>
        interaction.followUp({
            embeds: [embedErro(msg)],
            ephemeral: true
        });

    const sucesso = (msg) =>
        interaction.followUp({
            embeds: [embedSucesso(msg)],
            ephemeral: true
        });

    // garante resposta base
    if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ ephemeral: true });
    }

    try {

        // ================= CANAL FILA =================
        if (id === "select_fila") {

            const canalId = interaction.values?.[0];
            if (!canalId) return erro("Canal inválido.");

            context.setCanalFilaCompleta(canalId);
            await salvarDados();

            return interaction.editReply({
                content: `✅ Canal da fila definido para <#${canalId}>`
            });
        }

        // ================= CANAL BAN =================
        if (id === "select_ban") {

            const canalId = interaction.values?.[0];
            if (!canalId) return erro("Canal inválido.");

            context.setCanalBan(canalId);
            await salvarDados();

            return interaction.editReply({
                content: `✅ Canal de ban definido para <#${canalId}>`
            });
        }

        return false;

    } catch (err) {
        console.error("Erro adminButtons:", err);
        await erro("Erro interno ao processar ação.");
        return true;
    }
};