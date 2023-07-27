using Api_Fortes.Model;
using Api_Fortes.Service.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Api_Fortes.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FornecedorController : ControllerBase
    {
        private ILogger _logger;
        private IFornecedorRepository _service;
        public FornecedorController(ILogger<FornecedorController> logger, IFornecedorRepository service)
        {
            _logger = logger;
            _service = service;
        }
        [HttpGet("/api/fornecedores")]
        public async Task<ActionResult<IEnumerable<Produto>>> GetFornecedores(int _page = 1, int _limit = 5, string cnpj_like = "")
        {
            var fornecedores = _service.GetFornecedores();

            if (!string.IsNullOrWhiteSpace(cnpj_like) && (cnpj_like != "_all"))
                fornecedores = fornecedores.Where(x => x.Cnpj.Contains(cnpj_like)).ToList();


            if (fornecedores is null)
            {
                return NotFound("Fornecedores não existem");
            }

            int totalCount = fornecedores.Count();

            fornecedores = fornecedores.ToList().Skip((_page - 1) * _limit).Take(_limit).ToList();
            Response.Headers.Add("x-total-count", totalCount.ToString());
            return Ok(fornecedores);           
;
        }

        [HttpGet("/api/fornecedores/{cnpj}")]
        public async Task<ActionResult<Produto>> GetFornecedor(string cnpj)
        {
            var fornecedor = _service.GetFornecedor(cnpj); 
            if (fornecedor is null)
            {
                return NotFound("Fornecedor não encontrado");
            }
            return Ok(fornecedor);
        }

        [HttpPost("/api/fornecedores")]
        public async Task<ActionResult> AddFornecedor([FromBody] Fornecedor fornecedor)
        {
            try
            {
                var fornecedorAux = _service.GetFornecedor(fornecedor.Cnpj);


                if(fornecedorAux!= null && !string.IsNullOrEmpty(fornecedorAux.Cnpj))
                    return BadRequest("Já existe um fornecedor cadastrado com esse CNPJ!");

                var newFornecedor = new Fornecedor(fornecedor.Cnpj, fornecedor.RazaoSocial, fornecedor.Uf, fornecedor.Email, fornecedor.NomeContato);

                if (fornecedor == null)
                    return BadRequest("Dados inválidos");

                if (_service.AddFornecedor(newFornecedor))
                    return Ok(newFornecedor);
                else
                    return UnprocessableEntity("Fornecedor não inserido");
            }
            catch (Exception ex)
            {
                return UnprocessableEntity(ex.Message);
            }

        }

        [HttpPut("/api/fornecedores/{cnpj}")]
        public async Task<ActionResult> UpdateFornecedor(string cnpj, [FromBody] Fornecedor fornecedor)
        {
            try
            {
                if (string.IsNullOrEmpty(cnpj) || cnpj != fornecedor.Cnpj || fornecedor == null)
                    return BadRequest("Dados inválidos");

                var newFornecedor = new Fornecedor(fornecedor.Cnpj, fornecedor.RazaoSocial, fornecedor.Uf, fornecedor.Email, fornecedor.NomeContato);

                if (_service.UpdateFornecedor(cnpj, newFornecedor))
                    return Ok(newFornecedor);
                else
                    return UnprocessableEntity("Fornecedor não atualizado");
            }
            catch (Exception ex)
            {
                return UnprocessableEntity(ex.Message);
            }
        }

        [HttpDelete("/api/fornecedores/{cnpj}")]
        public async Task<ActionResult> DeleteProduto(string cnpj)
        {
            if (_service.DeleteFornecedor(cnpj))
            {
                return Ok(cnpj);
            }
            return UnprocessableEntity("Não foi possivel excluir o fornecedor");
        }
    }
}
