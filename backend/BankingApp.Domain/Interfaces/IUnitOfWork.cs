namespace BankingApp.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IAccountRepository Accounts { get; }
    ITransactionRepository Transactions { get; }
    Task<int> SaveChangesAsync();
}
