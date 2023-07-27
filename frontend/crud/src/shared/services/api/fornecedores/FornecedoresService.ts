import { Environment } from '../../../environment';
import { Api } from '../axios-config';


export interface IListagemFornecedor {
    razaoSocial: string;
    cnpj: string;
    uf: string;
    email: string;
    nomeContato: string;
}

export interface IDetalheFornecedor {
    razaoSocial: string;
    cnpj: string;
    uf: string;
    email: string;
    nomeContato: string;
}

type TFornecedoresComTotalCount = {
  data: IListagemFornecedor[];
  totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TFornecedoresComTotalCount | Error> => {
  try {
    let urlRelativa = `/fornecedores?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}`;

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
      };
    }

    return new Error(Environment.ERRO_LISTAR_REGISTRO);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || Environment.ERRO_LISTAR_REGISTRO);
  }
};

const getById = async (cnpj: string): Promise<IDetalheFornecedor | Error> => {
  try {
    const { data } = await Api.get(`/fornecedores/${cnpj}`);

    if (data) {
      return data;
    }

    return new Error(Environment.ERRO_CONSULTAR_REGISTRO);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || Environment.ERRO_CONSULTAR_REGISTRO);
  }
};

const create = async (dados: Omit<IDetalheFornecedor, 'cnpj'>): Promise<string | Error> => {
  try {
    const { data } = await Api.post<IDetalheFornecedor>('/fornecedores', dados);

    if (data) {
      return data.cnpj;
    }

    return new Error(Environment.ERRO_CRIAR_REGISTRO);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || Environment.ERRO_CRIAR_REGISTRO);
  }
};

const updateById = async (cnpj: string, dados: IDetalheFornecedor): Promise<void | Error> => {
  try {
    await Api.put(`/fornecedores/${cnpj}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || Environment.ERRO_ATUALIZAR_REGISTRO);
  }
};

const deleteById = async (cnpj: string): Promise<void | Error> => {
  try {
    await Api.delete(`/fornecedores/${cnpj}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || Environment.ERRO_APAGAR_REGISTRO);
  }
};


export const FornecedoresService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
