using System.ComponentModel.DataAnnotations;

namespace Api_Fortes.Model
{
    public class Base
    {
        [Key]
        public int Codigo { get; set; }

        [Display(Name = "Data")]
        [DataType(DataType.Date)]
        [Required(ErrorMessage = "A data de é requerida")]
        [DisplayFormat(DataFormatString = "{0: dd/MM/yyyy hh:mm}", ApplyFormatInEditMode = true)]
        public DateTime Data { get; set; }
    }
}
