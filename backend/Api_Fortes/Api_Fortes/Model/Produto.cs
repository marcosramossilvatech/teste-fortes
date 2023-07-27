using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using Api_Fortes.Validation;
using System;

namespace Api_Fortes.Model
{
    public class Produto : Base
    {
        public string? Descricao { get; set; }
        public decimal Valor { get; set; }

        public Produto() { }

        public Produto(string descricao, DateTime data, decimal valor)
        {
            ValidateDomain(descricao, data);
            DomainExceptionValidation.When(valor <= 0, "Valor inválido.");
            Valor = valor;

        }
        public Produto(int codigo, string descricao, DateTime data, decimal valor)
        {
            DomainExceptionValidation.When(codigo < 0, "Id inválido.");
            Codigo = codigo;
            ValidateDomain(descricao, data);
            DomainExceptionValidation.When(valor <=0, "Valor do produto inválido.");
            Valor = valor;

        }
        private void ValidateDomain(string descricao, DateTime data)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(descricao),
                "Descrição é obrigatório");

            DomainExceptionValidation.When(descricao.Length < 3,
               "Descrição inválido");

            Descricao = descricao;
            Data = data;
        }

        [JsonIgnore]
        public ICollection<Pedido>? Pedidos { get; set; }
    }
}
