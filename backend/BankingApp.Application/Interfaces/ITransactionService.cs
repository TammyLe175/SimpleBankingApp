using BankingApp.Application.DTOs;

namespace BankingApp.Application.Interfaces;

public interface ITransactionService
{
    Task<IEnumerable<TransactionDto>> GetTransactionsAsync(int accountId, string? category = null);
    Task<IEnumerable<ExpenseSummaryDto>> GetExpenseSummaryAsync(int accountId);
    Task<TransactionDto> CreateTransactionAsync(int accountId, CreateTransactionDto dto);
}
