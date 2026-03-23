using BankingApp.Application.DTOs;
using BankingApp.Application.Interfaces;
using BankingApp.Domain.Entities;
using BankingApp.Domain.Interfaces;

namespace BankingApp.Application.Services;

public class TransactionService : ITransactionService
{
    private readonly IUnitOfWork _unitOfWork;

    public TransactionService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<TransactionDto>> GetTransactionsAsync(int accountId, string? category = null)
    {
        var account = await _unitOfWork.Accounts.GetByIdAsync(accountId);
        if (account is null)
            throw new KeyNotFoundException("Account not found.");

        var transactions = await _unitOfWork.Transactions.GetByAccountIdAsync(accountId, category);
        return transactions.Select(t => new TransactionDto(
            t.Id, t.AccountId, t.Amount, t.Type, t.Category, t.Description, t.Date));
    }

    public async Task<IEnumerable<ExpenseSummaryDto>> GetExpenseSummaryAsync(int accountId)
    {
        var account = await _unitOfWork.Accounts.GetByIdAsync(accountId);
        if (account is null)
            throw new KeyNotFoundException("Account not found.");

        var expenses = await _unitOfWork.Transactions.GetExpensesByAccountIdAsync(accountId);
        return expenses
            .GroupBy(t => t.Category)
            .Select(g => new ExpenseSummaryDto(g.Key, g.Sum(t => t.Amount), g.Count()));
    }

    public async Task<TransactionDto> CreateTransactionAsync(int accountId, CreateTransactionDto dto)
    {
        var account = await _unitOfWork.Accounts.GetByIdAsync(accountId);
        if (account is null)
            throw new KeyNotFoundException("Account not found.");

        if (dto.Amount <= 0)
            throw new ArgumentException("Amount must be greater than zero.");

        if (dto.Type != "Deposit" && dto.Type != "Withdrawal")
            throw new ArgumentException("Type must be 'Deposit' or 'Withdrawal'.");

        if (dto.Type == "Withdrawal" && account.Balance < dto.Amount)
            throw new InvalidOperationException("Insufficient funds.");

        if (dto.Type == "Deposit")
            account.Balance += dto.Amount;
        else
            account.Balance -= dto.Amount;

        var transaction = new Transaction
        {
            AccountId = accountId,
            Amount = dto.Amount,
            Type = dto.Type,
            Category = dto.Category,
            Description = dto.Description
        };

        await _unitOfWork.Transactions.AddAsync(transaction);
        await _unitOfWork.SaveChangesAsync();

        return new TransactionDto(
            transaction.Id, transaction.AccountId, transaction.Amount,
            transaction.Type, transaction.Category, transaction.Description, transaction.Date);
    }
}
