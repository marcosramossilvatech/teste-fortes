import { useEffect, useMemo, useState } from "react";
import moment from 'moment'
import { useNavigate, useSearchParams } from "react-router-dom";
import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useDebounce } from "../../shared/hooks";
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from '@mui/material';
import { Environment } from "../../shared/environment";
import { IListagemPedido, PedidosService } from "../../shared/services/api/pedidos/PedidosService";


export const ListagemDePedidos: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {debounce} = useDebounce();
  const navigate = useNavigate();

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina') || '1');
  }, [searchParams]);

  const [rows, setRows] = useState<IListagemPedido[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalSum, setTotalSum] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() =>{
    setIsLoading(true);

    debounce(()=>{
      PedidosService.getAll(pagina, busca)
      .then( (result) => {
        setIsLoading(false);
        if(result instanceof Error){
          alert(result.message);
        }else{
          console.log(result.totalSum);
          setTotalCount(result.totalCount);
          setTotalSum(result.totalSum);
          setRows(result.data);
        }
      });
    });
  }, [pagina, busca]);

  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'BRL', // Código da moeda - BRL para Real brasileiro
    minimumFractionDigits: 2, // Número mínimo de casas decimais
    maximumFractionDigits: 2, // Número máximo de casas decimais
  };

  const handleDelete = (codigo: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(Environment.CONFIRMACAO_DELETE)) {
      PedidosService.deleteById(codigo)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow.codigo !== codigo),
            ]);
            alert(Environment.APAGADO_SUCESSO);
          }
        });
    }
  };

  return (
    <LayoutBaseDePagina
       titulo= 'Listagem de pedidos'
      barraDeFerramentas={
      <FerramentasDaListagem 
        mostrarInputBusca
        textoDaBusca={busca}
        aoClicarEmNovo={() => navigate('/pedidos/detalhe/novo')}
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
              <TableCell>Fornecedor</TableCell>
              <TableCell>Data cadastro</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Quantidade produto</TableCell>
              <TableCell>Valor total</TableCell>
              <TableCell width={100}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.codigo}>               
                <TableCell>{row.codigoFornecedor}</TableCell>
                <TableCell>{row.fornecedor.razaoSocial}</TableCell>
                <TableCell>{ moment(row.data).utcOffset(-3).format('DD/MM/YYYY')}</TableCell>
                <TableCell>{row.produto.descricao}</TableCell> 
                <TableCell>{row.quantidade}</TableCell> 
                <TableCell>{row.valorTotal.toLocaleString('pt-BR', options)}</TableCell> 
                <TableCell>
                  <IconButton size="small" onClick={() => handleDelete(row.codigo)}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton size="small" onClick={() => navigate(`/pedidos/detalhe/${row.codigo}`)}>
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
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="h6">Valor total de pedidos  R$ ${totalSum}</Typography>
                </TableCell>
              </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </LayoutBaseDePagina>
  );
};
