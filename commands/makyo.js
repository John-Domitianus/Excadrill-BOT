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

    if (message.content !== "!makyo") return;

    if (canalPyaku && message.channel.id !== canalPyaku)
        return message.reply({ embeds: [embedErro("Este comando só pode ser usado no canal Pyaku definido.")] });

    return message.reply({
        embeds: [
            {
                color: 0x5865F2,
                title: "🎯 Painel Makyo",
                description: "Aqui você pode entrar nas filas do Makyo, ver vagas disponíveis e sair da fila quando quiser.",
                fields: [
                    { name: "Makyo Normal", value: "Entre o andar 1 e 100." },
                    { name: "Makyo Avançado", value: "Acima do andar 100+." },
                    { name: "Observação", value: "Você só pode entrar uma vez por dia, então tenha atenção em qual vai clicar." }
                ]
            }
        ],
        components: [
            {
                type: 1,
                components: [
                    { type: 2, style: 3, label: "Entrar Makyo", custom_id: "abrir_makyo" },
                    { type: 2, style: 2, label: "Ver vagas", custom_id: "ver_vagas" },
                    { type: 2, style: 4, label: "Sair", custom_id: "sair_fila" }
                ]
            }
        ]
    });
};