function sayHello() {
    console.log("Hello!");
}
sayHello();
class Position {
    constructor(name) {
        this.name = "";
        this.name = name;
    }
    isEqualTo(position) {
        return true;
    }
}

const formatCdPedParcela = (nuSeqParcela, nuAnoPedParcela) => {
    return `${String("0000" + nuSeqParcela).slice(-4)}/${nuAnoPedParcela}`;
};

const getNuProcessoFormatado = (cdPedParcProcesso, nuAnoProcesso) => {
    return `${nuAnoProcesso}/${String("00000000" + cdPedParcProcesso).slice(-8)}`;
};

const formatNuSeqPedParcel = (nuSeqPedParcela) => {
    return String("000" + nuSeqPedParcela).slice(-9);
};

const formatCdPedParcProcesso = (cdPedParcelaProcesso) => {
    return String("00000000" + cdPedParcelaProcesso).slice(-8);
};

const formatDocument = (document) => {
    if (document.length == 11) {
        return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    else {
        return document.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1})/, "$1.$2.$3/$4-$5");
    }
    console.log("I'm alive");
    if (false) {
        console.log("I'm dead");
    }
};

const deadCode = () => {
    console.log("I'm alive");
    if (false) {
        console.log("I'm dead");
    }
};