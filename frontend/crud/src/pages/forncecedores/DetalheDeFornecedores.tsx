import { useEffect, useState } from "react";
import { Box, Grid,  LinearProgress, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from 'yup';

import { IVFormErrors, VForm, VTextField, useVForm } from "../../shared/forms";
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { Environment } from "../../shared/environment";
import { FornecedoresService } from "../../shared/services/api/fornecedores/FornecedoresService";



// interface IFormData {
//   razaoSocial: string;
//   cnpj: string;
//   uf: string;
//   email: string;
//   nomeContato: string;
// }

// const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
//   razaoSocial: yup.string().required().min(3).max(100),
//   cnpj: yup.string().required().min(20),
//   uf: yup.string(),
//   email: yup.string(),
//   nomeContato: yup.string().max(100),
// });


export const DetalheDeFornecedores: React.FC = () => {
    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
    const {cnpj = 'novo'} = useParams<'cnpj'>();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [razao, setRazao] = useState('');

     useEffect(() => {

      if (cnpj !== 'novo') {
        setIsLoading(true);
  
        FornecedoresService.getById(cnpj)
          .then((result) => {
           setIsLoading(false);

            if (result instanceof Error) {
              alert(result.message);
              navigate('/fornecedores');
            } else {
              setRazao(result.razaoSocial);
              console.log(result);
              formRef.current?.setData(result);
            }
          });
      } else {
        formRef.current?.setData({
          descricao: '',
          valor: undefined,
          data: new Date(),
        });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cnpj]);

   
    // const handleSave = (dados: IFormData) => {

    //   formValidationSchema
    //     .validate(dados, { abortEarly: false })
    //     .then((dadosValidados) => {
    //       setIsLoading(true);
  
    //       if (cnpj === 'novo') {

    //         FornecedoresService
    //           .create(dadosValidados)
    //           .then((result) => {
    //             setIsLoading(false);
  
    //             if (result instanceof Error) {
    //               alert(result.message);
    //             } else {
    //               if (isSaveAndClose()) {
    //                 navigate('/fornecedores');
    //               } else {
    //                 navigate(`/fornecedores/detalhe/${result}`);
    //               }
    //             }
    //           });
    //       } else {
    //         console.log('Alteração');
    //         FornecedoresService
    //           .updateById(cnpj, { ...dadosValidados })
    //           .then((result) => {
    //             setIsLoading(false);
  
    //             if (result instanceof Error) {
    //               alert(result.message);
    //             } else {
    //               if (isSaveAndClose()) {
    //                 navigate('/fornecedores');
    //               }
    //             }
    //           });
    //       }
    //     })
    //     .catch((errors: yup.ValidationError) => {
    //       const validationErrors: IVFormErrors = {};
    //       console.log(errors.inner);
    //       errors.inner.forEach((error) => {
    //         if (!error.path) return;
  
    //         validationErrors[error.path] = error.message;
    //       });
  
    //       formRef.current?.setErrors(validationErrors);
    //     });
    // };
    // const handleDelete=(cnpj: string) => {
    //   // eslint-disable-next-line no-restricted-globals
    //   if (confirm(Environment.CONFIRMACAO_DELETE)) {
    //     FornecedoresService.deleteById(cnpj)
    //       .then(result => {
    //         if (result instanceof Error) {
    //           alert(result.message);
    //         } else {
    //           alert(Environment.APAGADO_SUCESSO);
    //           navigate('/fornecedores');
    //         }
    //       });
    //   }
    // };

  function dayjs(arg0: string) {
    throw new Error("Function not implemented.");
  }

  return (
    <LayoutBaseDePagina
      titulo={
        cnpj === "novo"
          ? "Cadastrando novo fornecedor"
          : `Editando o fornecedor ${razao}`
      }
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Novo"
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={cnpj !== "novo"}
          mostrarBotaoApagar={cnpj !== "novo"}
          aoClicarEmVoltar={() => navigate("/fornecedores")}
          aoClicarEmNovo={() => navigate("/fornecedores/detalhe/novo")}
          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          //aoClicarEmApagar={() => handleDelete(cnpj)}
        />
      }
    >
      <VForm ref={formRef} onSubmit={() => console.log('Teste')}>
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
                  name="cnpj"
                  disabled={isLoading}
                  label="CNPJ"
                  // onChange={(e) => setDescr(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={12}>
                <VTextField
                  fullWidth
                  name="razaoSocial"
                  label="Razão Social"
                  disabled={isLoading}
                  onChange={(e) => setRazao(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={12}>
                <VTextField
                  fullWidth
                  name="uf"
                  label="UF"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={12}>
                <VTextField
                  fullWidth
                  name="email"
                  label="E-mail"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={12}>
                <VTextField
                  fullWidth
                  name="nomeContato"
                  label="Nome"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
            {/* <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <AutoCompleteCidade isExternalLoading={isLoading} />
              </Grid>
            </Grid> */}
          </Grid>
        </Box>
      </VForm>
    </LayoutBaseDePagina>
  );
};
