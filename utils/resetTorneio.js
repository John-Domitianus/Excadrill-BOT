function resetSingle(context) {

    context.filaSingle.length = 0;
    context.partidasSingle.length = 0;

    context.torneio.single = {
        aberto: true,
        sorteado: false
    };

}

function resetDouble(context) {

    context.filaDouble.length = 0;
    context.partidasDouble.length = 0;

    context.torneio.double = {
        aberto: true,
        sorteado: false
    };

}

module.exports = {
    resetSingle,
    resetDouble
};