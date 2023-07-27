using Api_Fortes.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Reflection.Emit;

namespace Api_Fortes.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
              : base(options)
        { }

        public DbSet<Fornecedor> Fornecedores { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {

            builder.Entity<Produto>().HasKey(t => t.Codigo);
            builder.Entity<Produto>().Property(p => p.Descricao).HasMaxLength(100).IsRequired();
            builder.Entity<Produto>().Property(p => p.Valor).HasPrecision(10, 2);

            builder.Entity<Fornecedor>().HasKey(t => t.Cnpj);
            builder.Entity<Fornecedor>().Property(t => t.Cnpj).HasMaxLength(20).IsRequired();
            builder.Entity<Fornecedor>().Property(p => p.RazaoSocial).HasMaxLength(100).IsRequired();
            builder.Entity<Fornecedor>().Property(p => p.Uf).HasMaxLength(2);
            builder.Entity<Fornecedor>().Property(p => p.Email).HasMaxLength(100);
            builder.Entity<Fornecedor>().Property(p => p.NomeContato).HasMaxLength(100);


            builder.Entity<Pedido>().HasKey(t => t.Codigo);
            builder.Entity<Pedido>().Property(t => t.CodProduto).IsRequired();
            builder.Entity<Pedido>().Property(t => t.Quantidade).IsRequired();
            builder.Entity<Pedido>().Property(t => t.CodigoFornecedor).HasMaxLength(20).IsRequired();
            builder.Entity<Pedido>().Property(p => p.ValorTotal).HasPrecision(10, 2).IsRequired();

            builder.Entity<Pedido>()
               .HasOne<Produto>(c => c.Produto)
               .WithMany(p => p.Pedidos)
               .HasForeignKey(c => c.CodProduto);

            builder.Entity<Pedido>()
               .HasOne<Fornecedor>(c => c.Fornecedor)
               .WithMany(p => p.Pedidos)
               .HasForeignKey(c => c.CodigoFornecedor);

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
