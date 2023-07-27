using Api_Fortes.Model;
using Api_Fortes.Service.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api_Fortes.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidoController : ControllerBase
    {
        private ILogger _logger;
        private IPedidoRepository _service;
        public PedidoController(ILogger<PedidoController> logger, IPedidoRepository service)
        {
            _logger = logger;
            _service = service;
        }
        [HttpGet("/api/pedidos")]
        public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidos([FromQuery] int page = 1, [FromQuery] int limit = 5)
        {
            var pedidos = _service.GetPedidos(); 
            if (pedidos is null)
            {
                return NotFound("Pedidos não existem");
            }
            int totalCount = pedidos.Count();

            pedidos = (List<Pedido>)pedidos.Skip((page - 1) * limit).Take(limit);
            Response.Headers.Add("X-Total-Count", totalCount.ToString());
            return Ok(pedidos);
        }

        [HttpGet("/api/pedidos/{codigo}")]
        public async Task<ActionResult<Pedido>> GetPedido(int codigo)
        {
            var pedidos = _service.GetPedido(codigo); 
            if (pedidos is null)
            {
                return NotFound("Pedido não encontrado");
            }
            return Ok(pedidos);
        }

        [HttpPost("/api/pedidos")]
        public async Task<ActionResult> AddPedido([FromBody] PedidoDTO pedidoDto)
        {
            try
            {
                var pedido = new Pedido(pedidoDto.Data, pedidoDto.CodProduto, pedidoDto.Quantidade, pedidoDto.CodigoFornecedor, pedidoDto.ValorTotal);

                if (pedido == null)
                    return BadRequest("Dados inválidos");

                if (_service.AddPedido(pedido))
                    return Ok(pedidoDto);
                else
                    return UnprocessableEntity("Pedido não inserido");
            }
            catch (Exception ex)
            {
                return UnprocessableEntity(ex.Message);
            }

        }

        [HttpPut("/api/pedidos/{codigo}")]
        public async Task<ActionResult> UpdatePedido(int codigo, [FromBody] PedidoDTO pedidoDto)
        {
            try
            {
                if (codigo != pedidoDto.Codigo || pedidoDto == null)
                    return BadRequest("Dados inválidos");

                var pedido = new Pedido(pedidoDto.Data, pedidoDto.CodProduto, pedidoDto.Quantidade, pedidoDto.CodigoFornecedor, pedidoDto.ValorTotal);

                if (_service.UpdatePedido(codigo, pedido))
                    return Ok(pedidoDto);
                else
                    return UnprocessableEntity("Pedido não atualizado");
            }
            catch (Exception ex)
            {
                return UnprocessableEntity(ex.Message);
            }
        }

        [HttpDelete("/api/pedidos/{codigo}")]
        public async Task<ActionResult> DeletePedido(int codigo)
        {
            if (_service.DeletePedido(codigo))
            {
                return Ok(codigo);
            }
            return UnprocessableEntity("Não foi possivel excluir o pedido.");
        }
    }
}
