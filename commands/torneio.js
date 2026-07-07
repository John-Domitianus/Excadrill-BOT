const { embedErro } = require("../utils/embeds");

module.exports = async (message, context) => {

    const { canalPyaku } = context;

    if (message.content.toLowerCase() !== "!torneio") return;

    if (canalPyaku && message.channel.id !== canalPyaku) {
        return message.reply({
            embeds: [
                embedErro("Este comando só pode ser usado no canal configurado.")
            ]
        });
    }

    return message.reply({
        embeds: [
            {
                color: 0x5865F2,
                title: "🏆 Painel Torneios",
                description:
                    "Participe dos torneios oficiais do Clã Buraco.\n\n" +
                    "Escolha uma modalidade para entrar na fila ou visualize os confrontos.",

                fields: [
                    {
                        name: "⚔️ Single",
                        value: "Partidas 1x1.",
                        inline: true
                    },
                    {
                        name: "👥 Double",
                        value: "Partidas em dupla (2x2).",
                        inline: true
                    },
                    {
                        name: "📌 Observação",
                        value: "Quando as inscrições forem encerradas, os confrontos serão sorteados automaticamente.",
                        inline: false
                    }
                ]
            }
        ],

        components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 3,
                        label: "Entrar Torneio",
                        custom_id: "abrir_guerra"
                    },
                    {
                        type: 2,
                        style: 2,
                        label: "Ver Torneio",
                        custom_id: "ver_guerra"
                    }
                ]
            }
        ]
    });

};