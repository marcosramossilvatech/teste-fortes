using Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api_Fortes.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
              : base(options)
        { }

        //public DbSet<Fornecedor> Fornecedores { get; set; }
        //public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        //public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Produto>().HasKey(c => c.Id);
            builder.Entity<Produto>().Property(c => c.Data).IsRequired();
            builder.Entity<Produto>().Property(c => c.Descricao).HasMaxLength(100).IsRequired();
            builder.Entity<Produto>().Property(c => c.Valor).IsRequired();

            // builder.Entity<Pedido>().HasOne(u => u.Produto);
            //builder.Entity<Pedido>().Wi
            //builder.Entity<Produto>()
            //    .HasOne(a => a.Pedido)
            //    .WithOne(b => b.Produto)
            //    .HasForeignKey<Pedido>(b => b.CodigoProduto);
            //.WithMany(b => b.Pedidos)
            //.HasForeignKey(p => p.CodigoProduto);

            //builder.Entity<Pedido>()
            //    .HasOne(p => p.Fornecedor);
            //.WithMany(b => b.Pedidos)
            //.HasForeignKey(p => p.CodigoFornecedor);
        }

    }
}
