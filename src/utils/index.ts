import { ITransacoes } from "../types";

export function pegarDiasNoMes(): number {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth(); // 0 = Janeiro, 11 = Dezembro

  // Dia 0 do próximo mês = último dia do mês atual
  return new Date(ano, mes + 1, 0).getDate();
}

export function calcularSaldo(transacoes: ITransacoes[]): number {
  return transacoes.reduce((total, transacao) => {
    return transacao.tipo === "receita" 
    ? total + transacao.valor 
    : total - transacao.valor
  }, 0);
}