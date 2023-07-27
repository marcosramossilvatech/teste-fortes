using Api_Fortes.Model;

namespace Api_Fortes.Service.Interface
{
    public interface IFornecedorRepository
    {
        public List<Fornecedor> GetFornecedores();
        public Fornecedor GetFornecedor(string cnpj);
        public bool AddFornecedor(Fornecedor fornecedor);
        public bool UpdateFornecedor(string cnpj, Fornecedor fornecedor);
        public bool DeleteFornecedor(string cnpj);
    }
}
