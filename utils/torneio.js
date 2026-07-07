function embaralhar(lista) {

    const array = [...lista];

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

    return array;

}

function gerarPartidasSingle(jogadores) {

    // O Single sempre precisa de quantidade par de jogadores
    if (jogadores.length % 2 !== 0) {
        throw new Error("Quantidade inválida de jogadores para o torneio Single.");
    }

    const embaralhados = embaralhar(jogadores);

    const partidas = [];

    for (let i = 0; i < embaralhados.length; i += 2) {

        partidas.push({
            jogador1: embaralhados[i],
            jogador2: embaralhados[i + 1]
        });

    }

    return partidas;

}

function gerarPartidasDouble(jogadores) {

    // O Double sempre precisa de múltiplos de 4 jogadores
    if (jogadores.length % 4 !== 0) {
        throw new Error("Quantidade inválida de jogadores para o torneio Double.");
    }

    const embaralhados = embaralhar(jogadores);

    const duplas = [];

    for (let i = 0; i < embaralhados.length; i += 2) {

        duplas.push([
            embaralhados[i],
            embaralhados[i + 1]
        ]);

    }

    const partidas = [];

    for (let i = 0; i < duplas.length; i += 2) {

        partidas.push({
            dupla1: duplas[i],
            dupla2: duplas[i + 1]
        });

    }

    return partidas;

}

module.exports = {
    gerarPartidasSingle,
    gerarPartidasDouble
};