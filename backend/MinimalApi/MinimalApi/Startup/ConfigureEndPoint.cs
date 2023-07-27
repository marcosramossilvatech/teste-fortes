using MinimalApi.EndPoints;

namespace MinimalApi.Startup
{
    public static class ConfigureEndPoint
    {
        public static void AddEndpoints( this WebApplication app)
        {
            ProdutosEndPoints.AddProdutosEndPoints(app);
        }
    }
}
