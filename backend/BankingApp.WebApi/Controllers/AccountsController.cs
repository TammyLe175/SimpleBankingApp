using Microsoft.AspNetCore.Mvc;
using BankingApp.Application.DTOs;
using BankingApp.Application.Interfaces;

namespace BankingApp.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountsController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AccountDto>>> GetAll()
    {
        var accounts = await _accountService.GetAllAccountsAsync();
        return Ok(accounts);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AccountDto>> Get([FromRoute] int id)
    {
        var account = await _accountService.GetAccountByIdAsync(id);
        if (account is null) return NotFound();

        return Ok(account);
    }

    [HttpPost]
    public async Task<ActionResult<AccountDto>> Create(CreateAccountDto dto)
    {
        var result = await _accountService.CreateAccountAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        var deleted = await _accountService.DeleteAccountAsync(id);
        if (!deleted) return NotFound();

        return NoContent();
    }
}
