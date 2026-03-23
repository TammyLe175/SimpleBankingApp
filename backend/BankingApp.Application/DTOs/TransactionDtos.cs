namespace BankingApp.Application.DTOs;

public record CreateTransactionDto(decimal Amount, string Type, string Category, string Description);

public record TransactionDto(int Id, int AccountId, decimal Amount, string Type, string Category, string Description, DateTime Date);

public record ExpenseSummaryDto(string Category, decimal Total, int Count);
