"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formataCPFCPNPJ = exports.formatCdPedParcProcesso = exports.formatNuSeqPedParcel = exports.getNuProcessoFormatado = exports.formatCdPedParcela = void 0;
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
exports.formatCdPedParcela = formatCdPedParcela;
const getNuProcessoFormatado = (cdPedParcProcesso, nuAnoProcesso) => {
    return `${nuAnoProcesso}/${String("00000000" + cdPedParcProcesso).slice(-8)}`;
};
exports.getNuProcessoFormatado = getNuProcessoFormatado;
const formatNuSeqPedParcel = (nuSeqPedParcela) => {
    return String("000" + nuSeqPedParcela).slice(-9);
};
exports.formatNuSeqPedParcel = formatNuSeqPedParcel;
const formatCdPedParcProcesso = (cdPedParcelaProcesso) => {
    return String("00000000" + cdPedParcelaProcesso).slice(-8);
};
exports.formatCdPedParcProcesso = formatCdPedParcProcesso;
const formataCPFCPNPJ = (cpfCnpj) => {
    if ((cpfCnpj === null || cpfCnpj === void 0 ? void 0 : cpfCnpj.length) == 11) {
        return cpfCnpj === null || cpfCnpj === void 0 ? void 0 : cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    else {
        return cpfCnpj === null || cpfCnpj === void 0 ? void 0 : cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1})/, "$1.$2.$3/$4-$5");
    }
    console.log("I'm alive");
    if (false) {
        console.log("I'm dead");
    }
    //return cpfCnpj?.length == 11 ? cpfCnpj?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : cpfCnpj?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1})/, "$1.$2.$3/$4-$5");
};
exports.formataCPFCPNPJ = formataCPFCPNPJ;
//# sourceMappingURL=teste.js.map