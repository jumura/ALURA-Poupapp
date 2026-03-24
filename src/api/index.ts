import axios from "axios";
import { ITransacoes, IUsuario } from "../types";
import { calcularSaldo, pegarDiasNoMes } from "../utils";

const api = axios.create({
    baseURL: "http://localhost:5000",
})

export const obterUsuario = async (): Promise<IUsuario[]> => {
    const { data } = await api.get<IUsuario[]>("/usuarios")
    return data
}

/*
! Omit
* O json-server gera automaticamente um ID, então aqui usamos o 'Omit' para receber um usuario do tipo IUsuario onde o atributo 'id' opcional, deixando para o json-server gerar o ID dele.
*/
export const criarUsuario = async (usuario: Omit<IUsuario, "id" | "orcamentoDiario">): Promise<IUsuario> => {
    const usuarioComOrcamentoDiario = {
        ...usuario,
        orcamentoDiario: usuario.renda / pegarDiasNoMes()
    }
    const { data } = await api.post<IUsuario>("/usuarios", usuarioComOrcamentoDiario)
    return data
}

export const atualizarUsuario = async (id: string, dados: Partial<IUsuario>): Promise<IUsuario> => {
    const { data } = await api.patch(`/usuarios/${id}`, dados)
    return data
}

export const obterTransacoes = async (): Promise<ITransacoes[]> => {
    const { data } = await api.get<ITransacoes[]>("/transacoes")
    return data
}

export const criarTransacao = async (transacao: Omit<ITransacoes, "id" | "userId">, usuario: Omit<IUsuario, "nome">): Promise<{transacao: ITransacoes, novoOrcamentoDiario: number}> => {
    const transacaoComId = { ...transacao, userId: usuario.id };
    const { data } = await api.post<ITransacoes>("/transacoes", transacaoComId);

    const transacoes = await obterTransacoes();
    const saldo = calcularSaldo(transacoes);

    const novoOrcamentoDiario = usuario.renda / pegarDiasNoMes() + saldo;
    
    await atualizarUsuario(usuario.id, {
        orcamentoDiario: novoOrcamentoDiario
    }).catch((error) => console.error(error))

    return {transacao: data, novoOrcamentoDiario}
}