namespace BankingApp.Application.DTOs;

public record CreateAccountDto(string Name, string AccountType);

public record AccountDto(int Id, string Name, string AccountType, decimal Balance, DateTime CreatedAt);
