using Api_Fortes.Context;
using Api_Fortes.Model;
using Api_Fortes.Service.Interface;
using Api_Fortes.Service;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

var connection = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
         options.UseSqlServer(connection,
             // especifica o nome do assembly onde as migrações estão localizadas
             b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));
// Add services to the container.
builder.Services.AddCors(options =>
                        {
                            options.AddPolicy("AllowAll",
                                builder =>
                                {
                                    builder.AllowAnyOrigin()                                            
                                            .AllowAnyHeader()
                                            .WithExposedHeaders("*")
                                            .AllowAnyMethod();
                                });
                        });

//builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseInMemoryDatabase("forteDB"));

builder.Services.AddControllers();
builder.Services.AddScoped<IProdutoRepository, ProdutoRepository>();
builder.Services.AddScoped<IFornecedorRepository, FornecedorRepositoy>();
builder.Services.AddScoped<IPedidoRepository, PedidoRepository>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAll");
app.UseAuthorization();

app.MapControllers();

app.Run();
