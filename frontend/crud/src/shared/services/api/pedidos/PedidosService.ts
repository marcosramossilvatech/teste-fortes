import { Environment } from '../../../environment';
import { Api } from '../axios-config';


export interface IListagemPedido {
    codigo: number;
    dataPedido: Date;
    codigoProduto: number;
    quantidadeProduto: number;
    codigoFornecedor: number;
    valorTotal: number;
}

export interface IDetalhePedido {
    codigo: number;
    dataPedido: Date;
    codigoProduto: number;
    quantidadeProduto: number;
    codigoFornecedor: number;
    valorTotal: number;
}

type TPedidossComTotalCount = {
  data: IListagemPedido[];
  totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TPedidossComTotalCount | Error> => {
  try {
    const urlRelativa = `/pedidos?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&codigoFornecedor_like=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }

    return new Error(Environment.ERRO_LISTAR_REGISTRO);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || Environment.ERRO_LISTAR_REGISTRO);
  }
};

const getById = async (codigo: number): Promise<IDetalhePedido | Error> => {
  try {
    const { data } = await Api.get(`/pedidos/${codigo}`);

    if (data) {
      return data;
    }

    return new Error(Environment.ERRO_CONSULTAR_REGISTRO);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || Environment.ERRO_CONSULTAR_REGISTRO);
  }
};

const create = async (dados: Omit<IDetalhePedido, 'codigo'>): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalhePedido>('/pedidos', dados);

    if (data) {
      return data.codigo;
    }

    return new Error(Environment.ERRO_CRIAR_REGISTRO);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || Environment.ERRO_CRIAR_REGISTRO);
  }
};

const updateById = async (codigo: number, dados: IDetalhePedido): Promise<void | Error> => {
  try {
    await Api.put(`/pedidos/${codigo}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || Environment.ERRO_ATUALIZAR_REGISTRO);
  }
};

const deleteById = async (codigo: number): Promise<void | Error> => {
  try {
    await Api.delete(`/pedidos/${codigo}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || Environment.ERRO_APAGAR_REGISTRO);
  }
};


export const PedidosService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
