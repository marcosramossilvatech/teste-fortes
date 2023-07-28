import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useDebounce } from '../../../shared/hooks';
import { useField } from '@unform/core';
import { FornecedoresService } from '../../../shared/services/api/fornecedores/FornecedoresService';


type TAutoCompleteOption = {
  id: string;
  label: string;
}

interface IAutoCompleteFornecedorProps {
  isExternalLoading?: boolean;
}
export const AutoCompleteFornecedor: React.FC<IAutoCompleteFornecedorProps> = ({ isExternalLoading = false }) => {
  const { fieldName, registerField, defaultValue, error, clearError } = useField('codigoFornecedor');
  const { debounce } = useDebounce();

  const [selectedCnpj, setSelectedCnpj] = useState<string | undefined>('_all');

  const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => selectedCnpj,
      setValue: (_, newSelectedId) => setSelectedCnpj(newSelectedId),
    });
  }, [registerField, fieldName, selectedCnpj]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
       FornecedoresService.getAll(1, busca)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            // alert(result.message);
          } else {
            console.log(result);

            setOpcoes(result.data.map(fornecedor => ({ id: fornecedor.cnpj, label: fornecedor.razaoSocial })));
          }
        });
    });
  }, [busca, selectedCnpj]);

  const autoCompleteSelectedOption = useMemo(() => {
    if (!selectedCnpj) return null;

    const selectedOption = opcoes.find(opcao => opcao.id === selectedCnpj);
    if (!selectedOption) return null;

    return selectedOption;
  }, [selectedCnpj, opcoes]);


  return (
    <Autocomplete
      openText='Abrir'
      closeText='Fechar'
      noOptionsText='Sem opções'
      loadingText='Carregando...'

      disablePortal

      options={opcoes}
      loading={isLoading}
      disabled={isExternalLoading}
      value={autoCompleteSelectedOption}
      onInputChange={(_, newValue) => setBusca(newValue)}
      onChange={(_, newValue) => { setSelectedCnpj(newValue?.id); setBusca(''); clearError(); }}
      popupIcon={(isExternalLoading || isLoading) ? <CircularProgress size={28} /> : undefined}
      renderInput={(params) => (
        <TextField
          {...params}

          label="CNPJ Fornecedor"
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
};
