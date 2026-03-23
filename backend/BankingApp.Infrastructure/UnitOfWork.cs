using BankingApp.Domain.Interfaces;
using BankingApp.Infrastructure.Data;

namespace BankingApp.Infrastructure;

public class UnitOfWork : IUnitOfWork
{
    public UnitOfWork(
        BankingDbContext context,
        IAccountRepository accounts,
        ITransactionRepository transactions)
    {
        _context = context;
        Accounts = accounts;
        Transactions = transactions;
    }

    private readonly BankingDbContext _context;
    public IAccountRepository Accounts { get; }
    public ITransactionRepository Transactions { get; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
