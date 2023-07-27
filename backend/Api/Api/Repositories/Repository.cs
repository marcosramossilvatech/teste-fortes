using Api.Entities;
using Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System;
using Api_Fortes.Context;

namespace Api.Repositories
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : Entity
    {
        protected readonly ApplicationDbContext _db;
        protected readonly DbSet<TEntity> DbSet;
        protected Repository(ApplicationDbContext db)
        {
            _db = db;
            DbSet = db.Set<TEntity>();
        }

        public async Task<IEnumerable<TEntity>> SearchAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await DbSet.AsNoTracking().Where(predicate).ToListAsync();
        }

        public async Task<TEntity> GetByIdAsync(int? id)
        {
            var entity = await DbSet.FindAsync(id);
            return entity;
        }

        public async Task<List<TEntity>> GetAllAsync()
        {
            var entities = await DbSet.ToListAsync();
            return entities;
        }

        public async Task AddAsync(TEntity entity)
        {
            DbSet.Add(entity);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(TEntity entity)
        {
            DbSet.Update(entity);
            await _db.SaveChangesAsync();
        }

        public async Task RemoveAsync(int? id)
        {
            var entity = await DbSet.FindAsync(id);
            DbSet.Remove(entity);
            await _db.SaveChangesAsync();
        }

        public void Dispose()
        {
            _db?.Dispose();
        }
    }
}
