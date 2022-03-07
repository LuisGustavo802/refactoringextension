import * as vscode from 'vscode';


function sayHello() {
  console.log("Hello!");
}
sayHello();
class Position implements Extracted {

  name: string = "";

  constructor(name: string) {
    this.name = name;
  }
  isEqualTo(position: Position): boolean {
    return true;
  }
}

interface Extracted {
  name: string;
  isEqualTo(position: Position): boolean;
}

export const formatCdPedParcela = (nuSeqParcela: number, nuAnoPedParcela: string): string => {
  return `${String("0000" + nuSeqParcela).slice(-4)}/${nuAnoPedParcela}`;
};

export const getNuProcessoFormatado = (cdPedParcProcesso: string, nuAnoProcesso: string): string => {
  return `${nuAnoProcesso}/${String("00000000" + cdPedParcProcesso).slice(-8)}`;
};

export const formatNuSeqPedParcel = (nuSeqPedParcela: string): string => {
  return String("000" + nuSeqPedParcela).slice(-9);
};

export const formatCdPedParcProcesso = (cdPedParcelaProcesso: string): string => {
  return String("00000000" + cdPedParcelaProcesso).slice(-8);
};

export const formataCPFCPNPJ = (cpfCnpj: string | undefined) => {
if (cpfCnpj?.length == 11) {
  return cpfCnpj?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
} else {
  return cpfCnpj?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1})/, "$1.$2.$3/$4-$5");
}

console.log("I'm alive");

if (false) {
  console.log("I'm dead");
}
  //return cpfCnpj?.length == 11 ? cpfCnpj?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : cpfCnpj?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1})/, "$1.$2.$3/$4-$5");
};
