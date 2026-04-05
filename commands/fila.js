// commands/fila.js
module.exports = {
    name: "setfila",
    description: "Define o canal atual como o canal da fila",
    async execute(message, context) {
        if (!message.member.permissions.has("Administrator")) {
            return message.reply("❌ Você precisa ser administrador para usar este comando.");
        }

        const canalId = message.channel.id;

        // Verifica se já existe um canal de fila
        if (context.canalFila === canalId) {
            return message.reply("⚠️ Este canal já está definido como canal da fila.");
        }

        context.canalFila = canalId;
        await context.salvarDados();

        return message.reply(`✅ Canal <#${canalId}> definido como o canal principal da fila.`);
    }
};