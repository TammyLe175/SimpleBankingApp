using BankingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BankingApp.Infrastructure.Data;

public class BankingDbContext : DbContext
{
    public BankingDbContext(DbContextOptions<BankingDbContext> options) : base(options) { }

    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.Property(a => a.Balance).HasColumnType("decimal(18,2)");
            entity.Property(a => a.Name).HasMaxLength(100).IsRequired();
            entity.Property(a => a.AccountType).HasMaxLength(50).IsRequired();
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.Property(t => t.Amount).HasColumnType("decimal(18,2)");
            entity.Property(t => t.Type).HasMaxLength(20).IsRequired();
            entity.Property(t => t.Category).HasMaxLength(50);
            entity.Property(t => t.Description).HasMaxLength(200);

            entity.HasOne(t => t.Account)
                  .WithMany(a => a.Transactions)
                  .HasForeignKey(t => t.AccountId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
