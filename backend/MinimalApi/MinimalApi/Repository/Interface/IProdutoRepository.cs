using MinimalApi.Model;

namespace MinimalApi.Repository.Interface
{
    public interface IProdutoRepository
    {
        public List<Produto> GetProdutos();
        public Produto GetProduto(int codigo);
        public void AddProduto(Produto produto);
        public void UpdateProduto(int codigo, Produto produto);
        public void DeleteProduto(int codigo);
    }
}
