namespace BankingApp.Domain.Entities;

public class Account
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string AccountType { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
