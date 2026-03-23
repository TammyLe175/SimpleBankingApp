using BankingApp.Domain.Entities;

namespace BankingApp.Domain.Interfaces;

public interface IAccountRepository
{
    Task<IEnumerable<Account>> GetAllAsync();
    Task<Account?> GetByIdAsync(int id);
    Task AddAsync(Account account);
    void Remove(Account account);
}
