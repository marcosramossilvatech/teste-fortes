import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useDebounce } from "../../shared/hooks";
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { Environment } from "../../shared/environment";
import { FornecedoresService, IListagemFornecedor } from "../../shared/services/api/fornecedores/FornecedoresService";


export const ListagemDeFornecedores: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {debounce} = useDebounce();
  const navigate = useNavigate();

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina') || '1');
  }, [searchParams]);

  const [rows, setRows] = useState<IListagemFornecedor[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() =>{
    setIsLoading(true);

    debounce(()=>{
      FornecedoresService.getAll(pagina, busca)
      .then( (result) => {
        setIsLoading(false);
        if(result instanceof Error){
          alert(result.message);
        }else{
          console.log(result);
          setTotalCount(result.totalCount);
          setRows(result.data);
        }
      });
    });
  }, [pagina, busca]);

  const handleDelete = (cnpj: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(Environment.CONFIRMACAO_DELETE)) {
      FornecedoresService.deleteById(cnpj)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow.cnpj !== cnpj),
            ]);
            alert(Environment.APAGADO_SUCESSO);
          }
        });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo='Listagem de fornecedores'
      barraDeFerramentas={
      <FerramentasDaListagem 
        mostrarInputBusca
        textoDaBusca={busca}
        aoClicarEmNovo={() => navigate('/fornecedores/detalhe/novo')}
        aoMudarTextoDeBusca={texto =>setSearchParams({busca:texto}, {replace: true})}
      />
    }
    >
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>           
             {/* <TableCell>Codigo</TableCell>    */}
              <TableCell>CNPJ</TableCell>
              <TableCell>Razão Social</TableCell>
              <TableCell>UF</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Nome Contato</TableCell>
              <TableCell width={100}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              
              <TableRow key={row.cnpj}> 
                <TableCell>{row.cnpj}</TableCell>              
                <TableCell>{row.razaoSocial}</TableCell>
                <TableCell>{row.uf}</TableCell>
                <TableCell>{row.email}</TableCell> 
                <TableCell>{row.nomeContato}</TableCell> 
                <TableCell>
                  <IconButton size="small" onClick={() => handleDelete(row.cnpj)}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton size="small" onClick={() => navigate(`/fornecedores/detalhe/${row.cnpj}`)}>
                    <Icon>edit</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          {totalCount === 0 && !isLoading && (
            <caption>{Environment.LISTAGEM_VAZIA}</caption>
          )}

          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <LinearProgress variant='indeterminate' />
                </TableCell>
              </TableRow>
            )}
            {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Pagination
                    page={pagina}
                    count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                    onChange={(_, newPage) => setSearchParams({ busca, pagina: newPage.toString() }, { replace: true })}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </TableContainer>
    </LayoutBaseDePagina>
  );
};
