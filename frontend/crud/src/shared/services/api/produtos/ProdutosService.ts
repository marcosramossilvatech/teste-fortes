import moment from 'moment';
import { Environment } from '../../../environment';
import { Api } from '../axios-config';


export interface IListagemProduto {
    codigo: number;
    descricao: string;
    data: string;
    valor: number;
}

export interface IDetalheProduto {
    codigo: number;
    descricao: string;
    data: string;
    valor: number;
}

type TProdutosComTotalCount = {
  data: IListagemProduto[];
  totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TProdutosComTotalCount | Error> => {
  try {
   

    let urlRelativa = `/produtos?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}`;
    if(filter){
      urlRelativa += `&descricao_like=${filter}`
    }else{
      urlRelativa += `&descricao_like=_all`
    }    
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

const getById = async (codigo: number): Promise<IDetalheProduto | Error> => {
  try {
    console.log('codigfazendo pesuisa');
    const { data } = await Api.get(`/produtos/${codigo}`);
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

const create = async (dados: Omit<IDetalheProduto, 'codigo'>): Promise<number | Error> => {
  try {
    console.log('Service');
    console.log(dados);
    const { data } = await Api.post<IDetalheProduto>('/produtos', dados);

    if (data) {
      return data.codigo;
    }

    return new Error(Environment.ERRO_CRIAR_REGISTRO);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || Environment.ERRO_CRIAR_REGISTRO);
  }
};

const updateById = async (codigo: number, dados: IDetalheProduto): Promise<void | Error> => {
  try {
    await Api.put(`/produtos/${codigo}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || Environment.ERRO_ATUALIZAR_REGISTRO);
  }
};

const deleteById = async (codigo: number): Promise<void | Error> => {
  try {
    await Api.delete(`/produtos/${codigo}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || Environment.ERRO_APAGAR_REGISTRO);
  }
};


export const ProdutosService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
