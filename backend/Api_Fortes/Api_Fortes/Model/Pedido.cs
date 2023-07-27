using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Api_Fortes.Validation;
using System.Drawing;

namespace Api_Fortes.Model
{
    public class Pedido : Base
    {
        public int CodProduto { get; set; }
        public int Quantidade { get; set; }
        public string? CodigoFornecedor { get; set; }
        public decimal ValorTotal { get; set; }

        public Pedido() { }

        public Pedido(DateTime data ,int codProduto, int quantidade, string codFornecedor ,decimal valorTotal)
        {
            ValidateDomain(codProduto, quantidade, codFornecedor, valorTotal);    
            Data = data;

        }
        public Pedido(int codigo, DateTime data , int codProduto, int quantidade, string codFornecedor, decimal valorTotal)
        {
            DomainExceptionValidation.When(codigo < 0, "Id inválido.");
            Codigo = codigo;
            ValidateDomain(codProduto, quantidade, codFornecedor, valorTotal);
            Data = data;

        }
        private void ValidateDomain(int codProduto, int quantidade, string codFornecedor, decimal valorTotal)
        {
            DomainExceptionValidation.When(codProduto < 1, "Produto é obrigatório");
            CodProduto = codProduto;
            DomainExceptionValidation.When(quantidade < 1, "Quantidade é obrigatório e maior que 0.");
            Quantidade = quantidade;
            DomainExceptionValidation.When(string.IsNullOrEmpty(codFornecedor),"Fornecedor é obrigatório");            
            DomainExceptionValidation.When(codFornecedor.Length < 3, "Fornecedor inválido");
            CodigoFornecedor = codFornecedor;
            DomainExceptionValidation.When(valorTotal <= 0, "Valor total inválido.");
            ValorTotal = valorTotal;
        }
        public virtual Produto? Produto { get; set; }
        public virtual Fornecedor? Fornecedor { get; set; }

    }
}
