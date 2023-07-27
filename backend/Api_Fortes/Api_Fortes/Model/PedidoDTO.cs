namespace Api_Fortes.Model
{
    public class PedidoDTO : Base
    {
        public int CodProduto { get; set; }
        public int Quantidade { get; set; }
        public string? CodigoFornecedor { get; set; }
        public decimal ValorTotal { get; set; }


    }
}
