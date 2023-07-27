using Api_Fortes.Context;
using Api_Fortes.Model;
using Api_Fortes.Service.Interface;
using Microsoft.EntityFrameworkCore;

namespace Api_Fortes.Service
{
    public class PedidoRepository : IPedidoRepository
    {
        private readonly ApplicationDbContext _context;
        public PedidoRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public bool AddPedido(Pedido pedido)
        {
            try
            {
                _context.Pedidos.Add(pedido);
                _context.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public bool DeletePedido(int codigo)
        {
            try
            {
                Pedido pedidoBase = _context.Pedidos.Single(p => p.Codigo == codigo);

                if (pedidoBase != null)
                {
                    _context.Pedidos.Remove(pedidoBase);
                    _context.SaveChanges();
                    return true;
                }
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public Pedido GetPedido(int codigo)
        {
            var listagem = _context.Pedidos.Where(x => x.Codigo == codigo).Include(p => p.Produto).Include(f => f.Fornecedor).ToList();
            if (listagem.Any())
            {
                return listagem.First();
            }
            else
            {
                return null;
            }

        }

        public List<Pedido> GetPedidos()
        {
            return _context.Pedidos.Include(p=> p.Produto).Include(f=>f.Fornecedor).ToList();
        }

        public bool UpdatePedido(int codigo, Pedido pedido)
        {
            try
            {
                Pedido pedidoBase = _context.Pedidos.Single(p => p.Codigo == codigo);

                if (pedidoBase != null)
                {
                    _context.Attach<Pedido>(pedidoBase);

                    pedidoBase.Codigo = pedido.Codigo;
                    pedidoBase.Data = pedido.Data;
                    pedidoBase.CodProduto = pedido.CodProduto;
                    pedidoBase.Quantidade = pedido.Quantidade;
                    pedidoBase.CodigoFornecedor = pedido.CodigoFornecedor;
                    pedidoBase.ValorTotal = pedido.ValorTotal;
                    _context.Pedidos.Update(pedidoBase);
                    _context.SaveChanges();
                    return true;
                }
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
