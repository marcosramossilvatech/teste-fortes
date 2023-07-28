using Api_Fortes.Model;
using Api_Fortes.Service.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

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
        public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidos(int _page = 1, int _limit = 5, string cnpj_like = "_all")
        {
            var pedidos = _service.GetPedidos();

            if (!string.IsNullOrWhiteSpace(cnpj_like) && (cnpj_like != "_all"))
                pedidos = pedidos.Where(x => x.CodigoFornecedor.Contains(cnpj_like)).ToList();

            if (pedidos is null)
            {
                return NotFound("Pedidos não existem");
            }


            int totalCount = pedidos.Count();

            pedidos = pedidos.ToList().Skip((_page - 1) * _limit).Take(_limit).ToList();
            Response.Headers.Add("x-total-count", totalCount.ToString());
            Response.Headers.Add("x-total-sum", pedidos.Sum(x=> x.ValorTotal).ToString());
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
                if (!DateTime.TryParse(pedidoDto.Data, out DateTime date))
                    return BadRequest("Data inválidos");

                          
                var pedido = new Pedido(date, pedidoDto.CodProduto, pedidoDto.Quantidade, pedidoDto.CodigoFornecedor, pedidoDto.ValorTotal);

                if (pedido == null)
                    return BadRequest("Dados inválidos");

                if (_service.AddPedido(pedido))
                {
                    pedidoDto.Codigo = pedido.Codigo;
                    return Ok(pedidoDto);
                }
                   
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
                var date = Convert.ToDateTime(pedidoDto.Data, CultureInfo.InvariantCulture);
                var pedido = new Pedido(date, pedidoDto.CodProduto, pedidoDto.Quantidade, pedidoDto.CodigoFornecedor, pedidoDto.ValorTotal);
                pedido.Codigo = codigo;
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
