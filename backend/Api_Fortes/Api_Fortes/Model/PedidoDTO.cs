using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace Api_Fortes.Model
{
    public class PedidoDTO
    {
        public int Codigo { get; set; }   
        public string Data { get; set; }
        public int CodProduto { get; set; }
        public int Quantidade { get; set; }
        public string? CodigoFornecedor { get; set; }
        public decimal ValorTotal { get; set; }


    }
}
