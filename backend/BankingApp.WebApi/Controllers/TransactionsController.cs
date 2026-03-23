using Microsoft.AspNetCore.Mvc;
using BankingApp.Application.DTOs;
using BankingApp.Application.Interfaces;

namespace BankingApp.WebApi.Controllers;

[ApiController]
[Route("api/accounts/{accountId}/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransactionDto>>> GetAll([FromRoute] int accountId, [FromQuery] string? category)
    {
        try
        {
            var transactions = await _transactionService.GetTransactionsAsync(accountId, category);
            return Ok(transactions);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("/api/accounts/{accountId}/expenses/summary")]
    public async Task<ActionResult<IEnumerable<ExpenseSummaryDto>>> GetExpenseSummary(int accountId)
    {
        try
        {
            var summary = await _transactionService.GetExpenseSummaryAsync(accountId);
            return Ok(summary);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost]
    public async Task<ActionResult<TransactionDto>> Create([FromRoute] int accountId, [FromBody] CreateTransactionDto dto)
    {
        try
        {
            var result = await _transactionService.CreateTransactionAsync(accountId, dto);
            return Created(string.Empty, result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
