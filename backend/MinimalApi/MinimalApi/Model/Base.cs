using System.ComponentModel.DataAnnotations;

namespace MinimalApi.Model
{
    public class Base
    {
        [Key]
        public int Codigo { get; set; }
        public DateTime Date { get; set; }
    }
}
