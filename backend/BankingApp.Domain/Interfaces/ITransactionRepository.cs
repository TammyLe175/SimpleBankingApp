using BankingApp.Domain.Entities;

namespace BankingApp.Domain.Interfaces;

public interface ITransactionRepository
{
    Task<IEnumerable<Transaction>> GetByAccountIdAsync(int accountId, string? category = null);
    Task<IEnumerable<Transaction>> GetExpensesByAccountIdAsync(int accountId);
    Task AddAsync(Transaction transaction);
}
