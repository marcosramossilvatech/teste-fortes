using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.DTOs
{
    public class ProdutoDTO
    {
        public int Id { get; set; }

        [Display(Name = "Data")]
        [DataType(DataType.Text)]
        [Required(ErrorMessage = "A data de é requerida")]
        [DisplayFormat(DataFormatString = "{0: dd/MM/yyyy}", ApplyFormatInEditMode = true)]
        public string? Data { get; set; }

        [Required(ErrorMessage = "A descrição é requerida")]
        [MinLength(3)]
        [MaxLength(100)]
        public string? Descricao { get; set; }

        [Required(ErrorMessage = "O valor é obrigatório")]
        [Column(TypeName = "decimal(10,2)")]
        [DisplayFormat(DataFormatString = "{0:C2}")]
        [DataType(DataType.Currency)]
        [DisplayName("Valor")]
        public decimal Valor { get; set; }
    }
}
