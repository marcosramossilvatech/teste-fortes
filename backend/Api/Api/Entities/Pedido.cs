namespace Api.Entities
{
    public class Pedido : Entity
    {
        public int IdProduto { get; set; }
        public int Quantidade { get; set; }
        public string? IdFornecedor { get; set; }
        public Decimal ValorTotal { get; set; }
        public virtual Produto? Produto { get; set; }
        public virtual Fornecedor? Fornecedor { get; set; }
    }
}
