using Api_Fortes.Context;
using Api_Fortes.Model;
using Api_Fortes.Service.Interface;

namespace Api_Fortes.Service
{
    public class FornecedorRepositoy : IFornecedorRepository
    {
        private readonly ApplicationDbContext _context;
        public FornecedorRepositoy(ApplicationDbContext context)
        {
            _context = context;                
        }
        public bool AddFornecedor(Fornecedor fornecedor)
        {
            try
            {
                _context.Fornecedores.Add(fornecedor);
                _context.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public bool DeleteFornecedor(string cnpj)
        {
            try
            {
                Fornecedor fornecedorBase = _context.Fornecedores.Single(p => p.Cnpj.Equals(cnpj));

                if (fornecedorBase != null)
                {
                    _context.Fornecedores.Remove(fornecedorBase);
                    _context.SaveChanges();
                    return true;
                }
                return false;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public Fornecedor GetFornecedor(string cnpj)
        {
            var listagem = _context.Fornecedores.Where(p => p.Cnpj.Equals(cnpj));

            if (listagem.Any())
            {
                return listagem.First();
            }
            else
            {
                return null;
            }

        }

        public List<Fornecedor> GetFornecedores()
        {
            return _context.Fornecedores.ToList<Fornecedor>();
        }

        public bool UpdateFornecedor(string cnpj, Fornecedor fornecedor)
        {
            try
            {
                Fornecedor fornecedorBase = _context.Fornecedores.Single(p => p.Cnpj.Equals(cnpj));

                if (fornecedorBase != null)
                {
                    _context.Attach<Fornecedor>(fornecedorBase);

                    fornecedorBase.Cnpj = fornecedor.Cnpj;
                    fornecedorBase.RazaoSocial = fornecedor.RazaoSocial;
                    fornecedorBase.Uf = fornecedor.Uf;
                    fornecedorBase.Email = fornecedor.Email;
                    fornecedorBase.NomeContato = fornecedor.NomeContato;

                    _context.Fornecedores.Update(fornecedorBase);
                    _context.SaveChanges();
                    return true;
                }
                return false;
            }
            catch (Exception)
            {
                return false;
            }

        }
    }
}
