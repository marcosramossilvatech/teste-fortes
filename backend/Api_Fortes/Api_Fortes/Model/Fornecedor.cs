using Api_Fortes.Validation;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Text.Json.Serialization;

namespace Api_Fortes.Model
{
    public class Fornecedor
    {
        [Key]
        public string? Cnpj { get; set; }
        public string? RazaoSocial { get; set; }
        public string? Uf { get; set; }
        public string? Email { get; set; }
        public string? NomeContato { get; set; }

        public Fornecedor() { }

        public Fornecedor(string cnpj, string razao, string uf, string email, string nomeContato)
        {
            ValidateDomain(cnpj, razao, uf, email, nomeContato);
        }
        private void ValidateDomain(string cnpj, string razao, string uf, string email, string nomeContato)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(cnpj) || string.IsNullOrEmpty(razao),
                "Campos obrigatório não preenchidos");

            DomainExceptionValidation.When(cnpj.Length < 3, "CNPJ inválido");
            Cnpj = cnpj;
            DomainExceptionValidation.When(razao.Length < 3, "Razão social inválido");
            RazaoSocial = razao;
            DomainExceptionValidation.When(uf.Length > 2, "UF inválido");
            Uf = uf;
            DomainExceptionValidation.When(email.Length < 3 || !email.Contains("@"), "E-mail inválido");
            Email = email;
            NomeContato = nomeContato;
        }

        [JsonIgnore]
        public ICollection<Pedido>? Pedidos { get; set; }

    }
}
