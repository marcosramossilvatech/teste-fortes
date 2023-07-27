using Api_Fortes.Model;

namespace Api_Fortes.Service.Interface
{
    public interface IProdutoRepository
    {
        public List<Produto> GetProdutos();
        public Produto GetProduto(int codigo);
        public bool AddProduto(Produto produto);
        public bool UpdateProduto(int codigo, Produto produto);
        public bool DeleteProduto(int codigo);
    }
}
