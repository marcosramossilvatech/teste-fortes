using Api.Entities;
using Api.Repositories.Interfaces;
using Api_Fortes.Context;

namespace Api.Repositories
{
    public class ProdutoRepository : Repository<Produto>, IProdutoRepository
    {
        public ProdutoRepository(ApplicationDbContext db) : base(db){}

    }
}
