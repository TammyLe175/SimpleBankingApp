using BankingApp.Application.DTOs;
using BankingApp.Application.Services;
using BankingApp.Domain.Entities;
using BankingApp.Domain.Interfaces;

namespace BankingApp.UnitTests;

public class AccountServiceTests
{
    [Fact]
    public async Task CreateAccountAsync_CreatesAccountWithZeroOpeningBalance()
    {
        var unitOfWork = new FakeUnitOfWork();
        var service = new AccountService(unitOfWork);

        var result = await service.CreateAccountAsync(new CreateAccountDto("Primary Checking", "Checking"));

        Assert.Equal("Primary Checking", result.Name);
        Assert.Equal("Checking", result.AccountType);
        Assert.Equal(0m, result.Balance);
        Assert.Single(unitOfWork.AccountRepository.StoredAccounts);
        Assert.Equal(1, unitOfWork.SaveChangesCallCount);
    }

    private sealed class FakeUnitOfWork : IUnitOfWork
    {
        public FakeUnitOfWork()
        {
            AccountRepository = new FakeAccountRepository();
            Accounts = AccountRepository;
            Transactions = new FakeTransactionRepository();
        }

        public FakeAccountRepository AccountRepository { get; }
        public IAccountRepository Accounts { get; }
        public ITransactionRepository Transactions { get; }
        public int SaveChangesCallCount { get; private set; }

        public Task<int> SaveChangesAsync()
        {
            SaveChangesCallCount++;
            return Task.FromResult(1);
        }

        public void Dispose()
        {
        }
    }

    private sealed class FakeAccountRepository : IAccountRepository
    {
        private int _nextId = 1;

        public List<Account> StoredAccounts { get; } = [];

        public Task<IEnumerable<Account>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<Account>>(StoredAccounts);
        }

        public Task<Account?> GetByIdAsync(int id)
        {
            return Task.FromResult(StoredAccounts.SingleOrDefault(account => account.Id == id));
        }

        public Task AddAsync(Account account)
        {
            account.Id = _nextId++;
            StoredAccounts.Add(account);
            return Task.CompletedTask;
        }

        public void Remove(Account account)
        {
            StoredAccounts.Remove(account);
        }
    }

    private sealed class FakeTransactionRepository : ITransactionRepository
    {
        public Task<IEnumerable<Transaction>> GetByAccountIdAsync(int accountId, string? category = null)
        {
            return Task.FromResult<IEnumerable<Transaction>>([]);
        }

        public Task<IEnumerable<Transaction>> GetExpensesByAccountIdAsync(int accountId)
        {
            return Task.FromResult<IEnumerable<Transaction>>([]);
        }

        public Task AddAsync(Transaction transaction)
        {
            return Task.CompletedTask;
        }
    }
}
