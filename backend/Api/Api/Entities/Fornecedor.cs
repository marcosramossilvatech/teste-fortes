using Api.Validation;
using System.Text.Json.Serialization;

namespace Api.Entities
{
    public class Fornecedor : Entity
    {
        public string? Cnpj { get; set; }
        public string? RazaoSocial { get; set; }
        public string? Uf { get; set; }
        public string? Email { get; set; }
        public string? NomeContato { get; set; }

        public Fornecedor() { }

        public Fornecedor(string cnpj, string razaoSocial, string uf, string email, string nomeContato)
        {
            ValidateDomain(cnpj, razaoSocial, uf, email, nomeContato);

        }
        private void ValidateDomain(string cnpj, string razaoSocial, string uf, string email, string nomeContato)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(cnpj),"CNPJ é obrigatório");

            DomainExceptionValidation.When(cnpj.Length < 11, "CNPJ inválido");
            Cnpj = cnpj;

            DomainExceptionValidation.When(string.IsNullOrEmpty(razaoSocial), "Razão é obrigatório");

            DomainExceptionValidation.When(razaoSocial.Length < 3, "Razão inválido");

            RazaoSocial = razaoSocial;

            DomainExceptionValidation.When(string.IsNullOrEmpty(uf), "UF é obrigatório");

            DomainExceptionValidation.When(uf.Length < 3, "UF inválido");

            Uf = uf;

            DomainExceptionValidation.When(string.IsNullOrEmpty(email), "Email é obrigatório");

            DomainExceptionValidation.When(email.Length < 3 || !email.Contains('@'), "Email inválido");

            Email = email;

            NomeContato = nomeContato;
        }

        [JsonIgnore]
        public ICollection<Pedido>? Pedido { get; set; }
    }
}
