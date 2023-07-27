using Api.Validation;
using System.Text.Json.Serialization;

namespace Api.Entities
{
    public class Produto : Entity
    {
        public string? Descricao { get; set; }
        public Decimal Valor { get; set; }


        public Produto(){}

        public Produto(string descricao, Decimal valor)
        {
            ValidateDomain(descricao);
            DomainExceptionValidation.When(valor < 0, "Valor inválido.");
            Valor = valor;
        }
        public Produto( int id,string descricao, Decimal valor)
        {
            DomainExceptionValidation.When(Id < 0, "Id inválido.");
            Id = id;
            ValidateDomain(descricao);
            DomainExceptionValidation.When(valor < 0, "Valor inválido.");
            Valor = valor;
        }
        private void ValidateDomain(string descricao)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(descricao),
                "Descrição é obrigatório");

            DomainExceptionValidation.When(descricao.Length < 3,
               "Descrição inválido");

            Descricao = descricao;
        }
        [JsonIgnore]
        public ICollection<Pedido>? Pedidos { get; set; }
    }
}
