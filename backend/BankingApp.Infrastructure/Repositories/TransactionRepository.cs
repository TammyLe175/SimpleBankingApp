using BankingApp.Domain.Entities;
using BankingApp.Domain.Interfaces;
using BankingApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BankingApp.Infrastructure.Repositories;

public class TransactionRepository : ITransactionRepository
{
    private readonly BankingDbContext _context;

    public TransactionRepository(BankingDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Transaction>> GetByAccountIdAsync(int accountId, string? category = null)
    {
        var query = _context.Transactions.Where(t => t.AccountId == accountId);

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(t => t.Category == category);

        return await query
            .OrderByDescending(t => t.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Transaction>> GetExpensesByAccountIdAsync(int accountId)
    {
        return await _context.Transactions
            .Where(t => t.AccountId == accountId && t.Type == "Withdrawal")
            .ToListAsync();
    }

    public async Task AddAsync(Transaction transaction)
    {
        await _context.Transactions.AddAsync(transaction);
    }
}
