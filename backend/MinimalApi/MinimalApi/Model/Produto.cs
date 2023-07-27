namespace MinimalApi.Model
{
    public class Produto : Base
    {
        public Produto()
        {
            //Pedidos = new List<Pedido>();
        }
        public string Descricao { get; set; }
        public Decimal Valor { get; set; }
        //public virtual List<Pedido> Pedidos { get; set; }

    }
}
