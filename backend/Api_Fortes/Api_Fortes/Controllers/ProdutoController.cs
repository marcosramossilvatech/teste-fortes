using Api_Fortes.Model;
using Api_Fortes.Service.Interface;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Security.Principal;

namespace Api_Fortes.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProdutoController : ControllerBase
    {
        private ILogger _logger;
        private IProdutoRepository _service;
        public ProdutoController(ILogger<ProdutoController> logger, IProdutoRepository service)
        {
            _logger = logger;
            _service = service;
        }
        [HttpGet("/api/produtos")]
        public async Task<ActionResult<IEnumerable<Produto>>> GetProdutos(int  _page = 1, int _limit = 5,  string descricao_like = "")
        {

            var produtos = _service.GetProdutos();

            if (!string.IsNullOrWhiteSpace(descricao_like)&&(descricao_like!= "_all"))
                produtos = produtos.Where(x => x.Descricao.Contains(descricao_like)).ToList();
            if (produtos is null)
            {
                return NotFound("Produtos não existem");
            }
            int totalCount = produtos.Count();

            produtos = produtos.ToList().Skip((_page - 1) * _limit).Take(_limit).ToList();
            Response.Headers.Add("x-total-count", totalCount.ToString());
            return Ok( produtos);
        }

        [HttpGet("/api/produtos/{codigo}")]
        public async Task<ActionResult<Produto>> Get(int codigo)
        {
            var produto = _service.GetProduto(codigo);
            if (produto is null)
            {
                return NotFound("Produto não encontrado");
            }
            return Ok(produto);
        }

        [HttpPost("/api/produtos")]
        public async Task<ActionResult> AddProduto([FromBody] ProdutoDTO produtoDto)
        {
            try
            {
                if (!DateTime.TryParse(produtoDto.Data, out DateTime date))
                    return BadRequest("Data inválidos");

                var newProduto = new Produto(produtoDto.Codigo, produtoDto.Descricao, date, produtoDto.Valor);

                if (produtoDto == null)
                    return BadRequest("Dados inválidos");

                if (_service.AddProduto(newProduto))
                {
                    produtoDto.Codigo = newProduto.Codigo;
                    return Ok(newProduto);
                }
                    
                else
                    return UnprocessableEntity("Produto não inserido");
            }
            catch (Exception ex)
            {
                return UnprocessableEntity(ex.Message);
            }

        }

        [HttpPut("/api/produtos/{codigo}")]
        public async Task<ActionResult> UpdateProduto(int codigo, [FromBody]  ProdutoDTO produtoDto)
        {
            try
            {
                if (!DateTime.TryParse(produtoDto.Data, out DateTime date))
                    return BadRequest("Data inválidos");

                if (codigo != produtoDto.Codigo || produtoDto == null)
                    return BadRequest("Dados inválidos");

                var newProduto = new Produto(produtoDto.Codigo, produtoDto.Descricao,date, produtoDto.Valor);
                newProduto.Codigo = codigo;
                if (_service.UpdateProduto(codigo, newProduto))
                    return Ok(produtoDto);
                else
                    return UnprocessableEntity("Produto não atualizado");
            }
            catch (Exception ex)
            {
                return UnprocessableEntity(ex.Message);
            }
        }

        [HttpDelete("/api/produtos/{codigo}")]
        public async Task<ActionResult> DeleteProduto(int codigo)
        {
            if (_service.DeleteProduto(codigo))
            {
                return Ok(codigo);
            }
            return UnprocessableEntity("Não foi possivel excluir o produto");
        }
    }
}
