using Api_Fortes.Model;

namespace Api_Fortes.Service.Interface
{
    public interface IPedidoRepository
    {
        public List<Pedido> GetPedidos();
        public Pedido GetPedido(int codigo);
        public bool AddPedido(Pedido pedido);
        public bool UpdatePedido(int codigo, Pedido pedido);
        public bool DeletePedido(int codigo);
    }
}
