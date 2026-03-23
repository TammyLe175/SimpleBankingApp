using BankingApp.Application.DTOs;
using BankingApp.Application.Interfaces;
using BankingApp.Domain.Entities;
using BankingApp.Domain.Interfaces;

namespace BankingApp.Application.Services;

public class AccountService : IAccountService
{
    private readonly IUnitOfWork _unitOfWork;

    public AccountService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<AccountDto>> GetAllAccountsAsync()
    {
        var accounts = await _unitOfWork.Accounts.GetAllAsync();
        return accounts.Select(a => new AccountDto(a.Id, a.Name, a.AccountType, a.Balance, a.CreatedAt));
    }

    public async Task<AccountDto?> GetAccountByIdAsync(int id)
    {
        var account = await _unitOfWork.Accounts.GetByIdAsync(id);
        if (account is null) return null;

        return new AccountDto(account.Id, account.Name, account.AccountType, account.Balance, account.CreatedAt);
    }

    public async Task<AccountDto> CreateAccountAsync(CreateAccountDto dto)
    {
        var account = new Account
        {
            Name = dto.Name,
            AccountType = dto.AccountType,
            Balance = 0
        };

        await _unitOfWork.Accounts.AddAsync(account);
        await _unitOfWork.SaveChangesAsync();

        return new AccountDto(account.Id, account.Name, account.AccountType, account.Balance, account.CreatedAt);
    }

    public async Task<bool> DeleteAccountAsync(int id)
    {
        var account = await _unitOfWork.Accounts.GetByIdAsync(id);
        if (account is null) return false;

        _unitOfWork.Accounts.Remove(account);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}
