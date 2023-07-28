import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { PedidosService } from '../../shared/services/api/pedidos/PedidosService';
import { FornecedoresService } from '../../shared/services/api/fornecedores/FornecedoresService';
import { ProdutosService } from '../../shared/services/api/produtos/ProdutosService';


export const Dashboard = () => {
  const [isLoadingPedidos, setIsLoadingPedidos] = useState(true);
  const [isLoadingProdutos, setIsLoadingProduto] = useState(true);
  const [isLoadingFornecedor, setIsLoadingFornecedor] = useState(true);
  const [totalCountPedidos, setTotalCountPedidos] = useState(0);
  const [totalCountProdutos, settotalCountProdutos] = useState(0);
  const [totalCountFornecedor, settotalCountFornecedor] = useState(0);
  const [totalSumPedidos, setTotalSumPedidos] = useState('');

  useEffect(() => {
    setIsLoadingPedidos(true);
    setIsLoadingProduto(true);

    PedidosService.getAll(1)
      .then((result) => {
        setIsLoadingPedidos(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setTotalCountPedidos(result.totalCount);
          setTotalSumPedidos(result.totalSum)
        }
      });
    ProdutosService.getAll(1)
      .then((result) => {
        setIsLoadingProduto(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          settotalCountProdutos(result.totalCount);
        }
      });

      FornecedoresService.getAll(1)
      .then((result) => {
        setIsLoadingFornecedor(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          settotalCountFornecedor(result.totalCount);
        }
      });
  }, []);


  return (
    <LayoutBaseDePagina
      titulo="Página inicial"
      barraDeFerramentas={<FerramentasDaListagem mostrarBotaoNovo={false} />}
    >
      <Box width="100%" display="flex">
        <Grid container margin={2}>
          <Grid item container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" align="center">
                    Total de Produtos cadastrados
                  </Typography>

                  <Box
                    padding={6}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {!isLoadingProdutos && (
                      <Typography variant="h1">{totalCountProdutos}</Typography>
                    )}
                    {isLoadingProdutos && (
                      <Typography variant="h6">Carregando...</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" align="center">
                    Total de pedidos cadastrados
                  </Typography>

                  <Box
                    padding={6}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {!isLoadingPedidos && (
                      <Typography variant="h1">{totalCountPedidos}</Typography>
                    )}
                    {isLoadingPedidos && (
                      <Typography variant="h6">Carregando...</Typography>
                    )}
                  </Box>
                  <Typography variant="h6">
                    Total de pedidos R$ ${totalSumPedidos}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" align="center">
                    Total de fornecedores cadastrados
                  </Typography>

                  <Box
                    padding={6}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {!isLoadingFornecedor && (
                      <Typography variant="h1">
                        {totalCountFornecedor}
                      </Typography>
                    )}
                    {isLoadingFornecedor && (
                      <Typography variant="h6">Carregando...</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LayoutBaseDePagina>
  );
};
