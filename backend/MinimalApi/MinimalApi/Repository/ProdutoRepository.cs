using Api_Fortes.Context;
using Api_Fortes.Model;
using MinimalApi.Repository.Interface;
using System;

namespace Api_Fortes.Service
{
    public class ProdutoRepository : IProdutoRepository
    {
        private readonly ApplicationDbContext _context;
        public ProdutoRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public void AddProduto(Produto produto)
        {
            _context.Produtos.Add(produto);
            _context.SaveChanges();
        }

        public void DeleteProduto(int codigo)
        {
            Produto produtoBase = _context.Produtos.Single(p => p.Codigo == codigo);

            if (produtoBase != null)
            {
                _context.Produtos.Remove(produtoBase);
                _context.SaveChanges();
            }
        }

        public Produto GetProduto(int codigo)
        {
            var listagem = _context.Produtos.Where(p => p.Codigo == codigo);

            if (listagem.Any())
            {
                return listagem.First();
            }
            else
            {
                return null;
            }

        }

        public List<Produto> GetProdutos()
        {
            return _context.Produtos.ToList<Produto>();
        }

        public void UpdateProduto(int codigo, Produto produto)
        {
            Produto produtoBase = _context.Produtos.Single(p => p.Codigo == codigo);

            if (produtoBase != null)
            {
                _context.Attach<Produto>(produtoBase);

                produtoBase.Codigo = produto.Codigo;
                produtoBase.Descricao = produto.Descricao;
                produtoBase.Valor = produto.Valor;

                _context.Produtos.Update(produtoBase);
                _context.SaveChanges();
            }
        }
    }
}
