using BankingApp.Application.DTOs;

namespace BankingApp.Application.Interfaces;

public interface IAccountService
{
    Task<IEnumerable<AccountDto>> GetAllAccountsAsync();
    Task<AccountDto?> GetAccountByIdAsync(int id);
    Task<AccountDto> CreateAccountAsync(CreateAccountDto dto);
    Task<bool> DeleteAccountAsync(int id);
}
