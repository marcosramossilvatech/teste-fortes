import { useEffect, useState } from "react";
import { Box, Grid,  LinearProgress, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from 'yup';

import { ProdutosService } from "../../shared/services/api/produtos/ProdutosService";
import { IVFormErrors,  VForm, VTextField, useVForm } from "../../shared/forms";
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { Environment } from "../../shared/environment";
import { AutoCompleteFornecedor } from "./components/AutoCompleteFornecedor";
import { AutoCompleteProduto } from "./components/AutoCompleteProduto";
import { PedidosService } from "../../shared/services/api/pedidos/PedidosService";



interface IFormData {
  data: string;
  codProduto: number;
  quantidade: number;
  codigoFornecedor: string;
  valorTotal: number;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  data: yup.string().default(new Date().toString()),
  codProduto: yup.number().required(),
  quantidade: yup.number().required(),
  codigoFornecedor: yup.string().required(),
  valorTotal: yup.number().required(),
});


export const DetalheDePedidos: React.FC = () => {
    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
    const {codigo = 'novo'} = useParams<'codigo'>();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [descr, setDescr] = useState('');
    console.log(codigo)
     useEffect(() => {
      console.log('Inicio')
      if (codigo !== 'novo') {
        setIsLoading(true);
  
        PedidosService.getById(Number(codigo))
          .then((result) => {
           setIsLoading(false);
            console.log('edit')
            console.log(result)
            if (result instanceof Error) {
              alert(result.message);
              navigate('/pedidos');
            } else {
              setDescr(result.codigo.toString());
              console.log(result);
              formRef.current?.setData(result);
            }
          });
      } else {
        formRef.current?.setData({
          data: undefined,
          codProduto: undefined,
          quantidade: undefined,
          codigoFornecedor: undefined,
          valorTotal: undefined,
        });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [codigo]);

   
    const handleSave = (dados: IFormData) => {
      console.log(dados);
      formValidationSchema
        .validate(dados, { abortEarly: false })
        .then((dadosValidados) => {
          setIsLoading(true);
          console.log('validado');
          if (codigo === 'novo') {
            console.log('criando');
            PedidosService
              .create(dadosValidados)
              .then((result) => {
                setIsLoading(false);
  
                if (result instanceof Error) {
                  alert(result.message);
                } else {
                  if (isSaveAndClose()) {
                    navigate('/pedidos');
                  } else {
                    navigate(`/pedidos/detalhe/${result}`);
                  }
                }
              });
          } else {
            console.log('editando');
            PedidosService
              .updateById(Number(codigo), {codigo: Number(codigo), ...dadosValidados })
              .then((result) => {
                setIsLoading(false);
  
                if (result instanceof Error) {
                  alert(result.message);
                } else {
                  if (isSaveAndClose()) {
                    navigate('/pedidos');
                  }
                }
              });
          }
        })
        .catch((errors: yup.ValidationError) => {
          const validationErrors: IVFormErrors = {};
          console.log(errors.inner);
          errors.inner.forEach((error) => {
            if (!error.path) return;
  
            validationErrors[error.path] = error.message;
          });
  
          formRef.current?.setErrors(validationErrors);
        });
    };
    const handleDelete=(codigo: number) => {
      // eslint-disable-next-line no-restricted-globals
      if (confirm(Environment.CONFIRMACAO_DELETE)) {
        ProdutosService.deleteById(codigo)
          .then(result => {
            if (result instanceof Error) {
              alert(result.message);
            } else {
              alert(Environment.APAGADO_SUCESSO);
              navigate('/pedidos');
            }
          });
      }
    };

  return (
    <LayoutBaseDePagina
      titulo={
        codigo === "novo"
          ? "Cadastrando novo pedido"
          : `Editando o pedido ${descr}`
      }
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Novo"
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={codigo !== "novo"}
          mostrarBotaoApagar={codigo !== "novo"}
          aoClicarEmVoltar={() => navigate("/pedidos")}
          aoClicarEmNovo={() => navigate("/pedidos/detalhe/novo")}
          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmApagar={() => handleDelete(Number(codigo))}
        />
      }
    >
      <VForm ref={formRef} onSubmit={handleSave}>
        <Box
          margin={1}
          display="flex"
          flexDirection="column"
          component={Paper}
          variant="outlined"
        >
          <Grid container direction="column" padding={2} spacing={2}>
            {isLoading && (
              <Grid item>
                <LinearProgress variant="indeterminate" />
              </Grid>
            )}

            <Grid item>
              <Typography variant="h6">Geral</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={12}>
              <VTextField
                  fullWidth
                  name="data"
                  disabled={isLoading}
                  label="Data do pedido"
                />       
              {/* <VDateField fullWidth name="data" label="Data do pedido"  disabled={isLoading} /> */}
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={12}>
                 <AutoCompleteProduto isExternalLoading={isLoading} />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={12}>
                <VTextField
                  fullWidth
                  name="quantidade"
                  disabled={isLoading}
                  label="Quantidade produto"
                />
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={12}>
                 <AutoCompleteFornecedor isExternalLoading={isLoading} />
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={12}>
                <VTextField
                  fullWidth
                  name="valorTotal"
                  label="Valor do produto"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </VForm>
    </LayoutBaseDePagina>
  );
};
