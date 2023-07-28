import { useEffect, useState } from "react";
import { Box, Grid,  LinearProgress, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from 'yup';

import { ProdutosService } from "../../shared/services/api/produtos/ProdutosService";
import { IVFormErrors,  VForm, VTextField, useVForm } from "../../shared/forms";
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { Environment } from "../../shared/environment";



interface IFormData {
  //codigo : number,
  descricao: string;
  data: string;
  valor : number;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  //codigo: yup.number().required().default(0),
  descricao: yup.string().required().min(3),
  data : yup.string().required(),
  valor : yup.number().required().min(0),
});


export const DetalheDeProdutos: React.FC = () => {
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
  
        ProdutosService.getById(Number(codigo))
          .then((result) => {
           setIsLoading(false);
            console.log('edit')
            console.log(result)
            if (result instanceof Error) {
              alert(result.message);
              navigate('/produtos');
            } else {
              setDescr(result.descricao);
              console.log(result);
              formRef.current?.setData(result);
            }
          });
      } else {
        formRef.current?.setData({
          descricao: '',
          valor: undefined,
          data: '',
        });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [codigo]);

   
    const handleSave = (dados: IFormData) => {

      formValidationSchema
        .validate(dados, { abortEarly: false })
        .then((dadosValidados) => {
          setIsLoading(true);
  
          if (codigo === 'novo') {
            console.log('Criação');
            console.log(dadosValidados);
            ProdutosService
              .create(dadosValidados)
              .then((result) => {
                setIsLoading(false);
  
                if (result instanceof Error) {
                  alert(result.message);
                } else {
                  if (isSaveAndClose()) {
                    navigate('/produtos');
                  } else {
                    navigate(`/produtos/detalhe/${result}`);
                  }
                }
              });
          } else {
            console.log('Alteração');
            ProdutosService
              .updateById(Number(codigo), {codigo: Number(codigo), ...dadosValidados })
              .then((result) => {
                setIsLoading(false);
  
                if (result instanceof Error) {
                  alert(result.message);
                } else {
                  if (isSaveAndClose()) {
                    navigate('/produtos');
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
              navigate('/produtos');
            }
          });
      }
    };


  return (
    <LayoutBaseDePagina
      titulo={
        codigo === "novo"
          ? "Cadastarndo novo produto"
          : `Editando o produto ${descr}`
      }
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Novo"
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={codigo !== "novo"}
          mostrarBotaoApagar={codigo !== "novo"}
          aoClicarEmVoltar={() => navigate("/produtos")}
          aoClicarEmNovo={() => navigate("/produtos/detalhe/novo")}
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
                  name="descricao"
                  disabled={isLoading}
                  label="Descrição do produto"
                  onChange={(e) => setDescr(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={12}>
              <VTextField
                  fullWidth
                  name="data"
                  disabled={isLoading}
                  label="Data cadastro"
                />
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={12}>
                <VTextField
                  fullWidth
                  name="valor"
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
