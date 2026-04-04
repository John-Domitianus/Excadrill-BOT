const { embedErro } = require("./utils/embeds");

module.exports = async (message, context) => {
    const { canalPyaku } = context;

    if (message.content !== "!guerra") return;

    if (canalPyaku && message.channel.id !== canalPyaku)
        return message.reply({ embeds: [embedErro("Este comando só pode ser usado no canal Pyaku definido.")] });

    return message.reply({
        embeds: [
            {
                color: 0xED4245,
                title: "⚔️ Painel Guerra",
                description: "Aqui você pode entrar na guerra escolhendo uma posição e ver a lista de participantes atuais.",
                fields: [
                    { name: "Titular", value: "Entre como jogador titular (linha de frente). Limite de 30 jogadores.", inline: true },
                    { name: "Reserva", value: "Entre como reserva. Limite de 10 jogadores.", inline: true },
                    { name: "Observação", value: "Você não poderá sair ao entrar, então escolha com atenção." }
                ]
            }
        ],
        components: [
            {
                type: 1,
                components: [
                    { type: 2, style: 3, label: "Entrar Guerra", custom_id: "abrir_guerra" },
                    { type: 2, style: 2, label: "Ver lista", custom_id: "ver_guerra" }
                ]
            }
        ]
    });
};