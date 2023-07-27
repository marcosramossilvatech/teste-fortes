using System;

namespace MinimalApi.EndPoints
{
    public static class ProdutosEndPoints
    {
        public static void AddProdutosEndPoints(this WebApplication app)
        {
            app.MapPost("/produtos/", async (Produto produto, AppDbContext db) => {
                produto.Categoria = db.Categorias.FirstOrDefault(x => x.CategoriaId == produto.CategoriaId);
                db.Produtos.Add(produto);
                await db.SaveChangesAsync();

                return Results.Created($"/produtos/{produto.ProdutoId}", produto);
            });

            app.MapGet("/produtos", async (AppDbContext db) => await db.Produtos.ToListAsync());

            app.MapGet("/produtos/{id:int}", async (int id, AppDbContext db) =>
            {
                //  var teste =  db.Produtos.Where(x => x.ProdutoId == id).Include(d => d.Categoria).ToList();

                var produto = await db.Produtos
                                .Include(p => p.Categoria) // Assuming there's a navigation property named "Categoria" in the Produto class representing the associated category
                                .FirstOrDefaultAsync(p => p.ProdutoId == id);

                if (produto != null)
                {
                    return Results.Ok(produto);
                }
                else
                {
                    return Results.NotFound();
                }


                //return await db.Produtos.FindAsync(id).Include(Categoria)
                //return await db.Produtos.FindAsync(id)
                //        is Produto produto
                //            ? Results.Ok(produto)
                //            : Results.NotFound();
            });

            app.MapPut("/produtos/{id:int}", async (int id, Produto produto, AppDbContext db) =>
            {
                if (produto.ProdutoId != id)
                {
                    return Results.BadRequest();
                }

                var produtoDB = await db.Produtos.FindAsync(id);

                if (produtoDB is null) return Results.NotFound();

                //found, so update with incoming note n.
                produtoDB.Nome = produto.Nome;
                produtoDB.Descricao = produto.Descricao;
                produtoDB.Preco = produto.Preco;
                produtoDB.DataCompra = produto.DataCompra;
                produtoDB.Estoque = produto.Estoque;
                produtoDB.Imagem = produto.Imagem;
                produtoDB.CategoriaId = produto.CategoriaId;

                await db.SaveChangesAsync();
                return Results.Ok(produtoDB);
            });


            app.MapDelete("/produtos/{id:int}", async (int id, AppDbContext db) => {

                var produto = await db.Produtos.FindAsync(id);

                if (produto is not null)
                {
                    db.Produtos.Remove(produto);
                    await db.SaveChangesAsync();
                }

                return Results.NoContent();

            });
        }
    }
}
