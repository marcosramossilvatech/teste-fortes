import moment from 'moment';
import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface produto {
  codigo: number;
  descricao: string;
  data: Date;
  valor: number;
}

export interface fornecedor {
  razaoSocial: string;
  cnpj: string;
  uf: string;
  email: string;
  nomeContato: string;
}
export interface IListagemPedido {
    codigo: number;
    data: string;
    codProduto: number;
    produto : produto;
    fornecedor : fornecedor;
    quantidade: number;
    codigoFornecedor: string;
    valorTotal: number;
}


export interface IDetalhePedido {
    codigo: number;
    data: string;
    codProduto: number;
    quantidade: number;
    codigoFornecedor: string;
    //fornecedor : fornecedor;
    valorTotal: number;
    //produto : produto;
}

type TPedidossComTotalCount = {
  data: IListagemPedido[];
  totalCount: number;
  totalSum : string;
}

const getAll = async (page = 1, filter = ''): Promise<TPedidossComTotalCount | Error> => {
  try {

    let urlRelativa = `/pedidos?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}`;

    if(filter){
      urlRelativa += `&cnpj_like=${filter}`
    }else{
      urlRelativa += `&cnpj_like=_all`
    }   

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
        totalSum : (headers['x-total-sum'] || '')
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
      data.data = moment(data.data).utcOffset(-3).format('DD/MM/YYYY');
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
    console.log('criando')
    console.log(dados)
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
