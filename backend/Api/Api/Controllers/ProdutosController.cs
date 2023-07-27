using Api.DTOs;
using Api.Entities;
using Api.Repositories.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProdutosController : ControllerBase
    {
        private readonly IProdutoRepository _produtoRepository;
        private readonly IMapper _mapper;
        public ProdutosController(IProdutoRepository produtoRepository, IMapper mapper)
        {
            _produtoRepository = produtoRepository;
            _mapper = mapper;
        }


        [HttpGet("/api/produtos")]
        public async Task<ActionResult<IEnumerable<ProdutoDTO>>> Get()
        {
            var produtos = await _produtoRepository.GetAllAsync();
            if (produtos is null)
            {
                return NotFound("Produtos não existem");
            }
            var produtosDto = _mapper.Map<IEnumerable<ProdutoDTO>>(produtos);
            return Ok(produtosDto);
        }

        [HttpGet("/api/produtos/{id}")]
        public async Task<ActionResult<ProdutoDTO>> Get(int id)
        {
            var produto = await _produtoRepository.GetByIdAsync(id);
            if (produto is null)
            {
                return NotFound("Produto não encontrado");
            }

            var produtoDto = _mapper.Map<ProdutoDTO>(produto);
            return Ok(produto);
        }

        [HttpPost("/api/produtos")]
        public async Task<ActionResult> Post(ProdutoDTO produtoDto)
        {
            if (produtoDto == null)
                return BadRequest("Dados inválidos");

            var produto = _mapper.Map<Produto>(produtoDto);

            await _produtoRepository.AddAsync(produto);

            return new CreatedAtRouteResult("GetProduto", new { id = produtoDto.Id },
                produtoDto);
        }

        [HttpPut("/api/produtos/{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] ProdutoDTO produtoDto)
        {
            if (id != produtoDto.Id)
                return BadRequest();

            if (produtoDto == null)
                return BadRequest();

            var produto = _mapper.Map<Produto>(produtoDto);

            await _produtoRepository.UpdateAsync(produto);

            return Ok(produtoDto);
        }

        [HttpDelete("/api/produtos/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var produto = await _produtoRepository.GetByIdAsync(id);
            if (produto == null)
            {
                return NotFound("Produto não encontrado");
            }

            await _produtoRepository.RemoveAsync(id);

            return Ok(produto);
        }
    }
}
