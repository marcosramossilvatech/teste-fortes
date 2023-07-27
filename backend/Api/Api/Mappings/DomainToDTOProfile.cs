using Api.DTOs;
using Api.Entities;
using AutoMapper;
using System;

namespace Api.Mappings
{
    public class DomainToDTOProfile : Profile
    {
        public DomainToDTOProfile()
        {
            CreateMap<Produto, ProdutoDTO>().ReverseMap();
           
        }
    }
}
