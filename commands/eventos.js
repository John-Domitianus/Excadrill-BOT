const { embedSucesso, embedErro } = require("../utils/embeds");
const { atualizarListaCompleta } = require("../utils/lista");
const { limiteCFK, limiteCFK100 } = require("../config/constants");

function hoje() {
    const d = new Date();
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function pegarHorario() {
    const agora = new Date();
    return `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
}

module.exports = async (message, context) => {
    const { canalPyaku, filaCFK, filaCFK100, controleDiario, salvarDados } = context;
    const nome = message.member.displayName;
    const hora = pegarHorario();

    if (message.content !== "!eventos") return;

    if (canalPyaku && message.channel.id !== canalPyaku)
        return message.reply({ embeds: [embedErro("Este comando só pode ser usado no canal Pyaku definido.")] });

    return message.reply({
        embeds: [
            {
                color: 0x5865F2,
                title: "🎯 Eventos do Clã Buraco",
                description:
                    "Sistema de eventos do clã. Escolha uma opção abaixo para participar.",
                fields: [
                    {
                        name: "📌 Evento Comum",
                        value: "Eventos realizados com frequência, com dificuldade padrão."
                    },
                    {
                        name: "⚡ Evento Especial",
                        value: "Eventos especiais, com regras diferenciadas e recompensas exclusivas."
                    },
                    {
                        name: "ℹ️ Regras",
                        value:
                            "• 1 participação por dia\n" +
                            "• Escolha com atenção antes de entrar\n" +
                            "• Sair da fila libera nova tentativa"
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
                        label: "Entrar Eventos",
                        custom_id: "abrir_eventos"
                    },
                    {
                        type: 2,
                        style: 2,
                        label: "Ver vagas",
                        custom_id: "ver_vagas"
                    },
                    {
                        type: 2,
                        style: 4,
                        label: "Sair",
                        custom_id: "sair_fila"
                    }
                ]
            }
        ]
    });
};