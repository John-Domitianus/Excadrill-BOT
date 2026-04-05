// commands/canal.js
const MAX_CANAIS = 2; // limite máximo de canais permitidos

module.exports = async (message, context) => {
    // Verifica permissão de administrador
    if (!message.member.permissions.has("Administrator")) {
        return message.reply("❌ Você precisa ser administrador para usar este comando.");
    }

    // Inicializa a lista de canais permitidos se ainda não existir
    if (!context.canaisPermitidos) context.canaisPermitidos = [];

    const canalId = message.channel.id;

    // Verifica se o canal já está na lista
    if (context.canaisPermitidos.includes(canalId)) {
        return message.reply("⚠️ Este canal já está na lista de canais permitidos.");
    }

    // Limite máximo de canais
    if (context.canaisPermitidos.length >= MAX_CANAIS) {
        return message.reply(`❌ Você já atingiu o limite de ${MAX_CANAIS} canais permitidos.`);
    }

    // Adiciona o canal
    context.canaisPermitidos.push(canalId);
    await context.salvarDados();

    return message.reply(`✅ Canal <#${canalId}> adicionado à lista de canais permitidos.`);
};