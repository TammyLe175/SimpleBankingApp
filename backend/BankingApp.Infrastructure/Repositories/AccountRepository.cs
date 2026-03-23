using BankingApp.Domain.Entities;
using BankingApp.Domain.Interfaces;
using BankingApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BankingApp.Infrastructure.Repositories;

public class AccountRepository : IAccountRepository
{
    private readonly BankingDbContext _context;

    public AccountRepository(BankingDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Account>> GetAllAsync()
    {
        return await _context.Accounts
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<Account?> GetByIdAsync(int id)
    {
        return await _context.Accounts.FindAsync(id);
    }

    public async Task AddAsync(Account account)
    {
        await _context.Accounts.AddAsync(account);
    }

    public void Remove(Account account)
    {
        _context.Accounts.Remove(account);
    }
}
