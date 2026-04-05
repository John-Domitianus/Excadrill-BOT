// commands/canal.js
const MAX_CANAIS = 2; // limite máximo de canais permitidos

module.exports = {
    name: "setcanal",
    description: "Adiciona o canal atual à lista de canais permitidos para usar o bot",
    async execute(message, context) {
        if (!message.member.permissions.has("Administrator")) {
            return message.reply("❌ Você precisa ser administrador para usar este comando.");
        }

        if (!context.canaisPermitidos) context.canaisPermitidos = [];

        const canalId = message.channel.id;

        if (context.canaisPermitidos.includes(canalId)) {
            return message.reply("⚠️ Este canal já está na lista de canais permitidos.");
        }

        if (context.canaisPermitidos.length >= MAX_CANAIS) {
            return message.reply(`❌ Você já atingiu o limite de ${MAX_CANAIS} canais permitidos.`);
        }

        context.canaisPermitidos.push(canalId);
        await context.salvarDados();

        return message.reply(`✅ Canal <#${canalId}> adicionado à lista de canais permitidos.`);
    }
};