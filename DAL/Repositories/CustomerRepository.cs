using System;
using System.Collections.Generic;
using System.Linq;
using DAL.Models;
using DAL.Repositories.Interfaces;

namespace DAL.Repositories
{
    public class CustomerRepository : Repository<Customer>, ICustomerRepository
    {
        public CustomerRepository(ApplicationDbContext context) : base(context)
        { }

        public IEnumerable<Customer> GetAllCustomersData()
        {
            return _appContext.Customers.ToList();
        }

        public IEnumerable<Customer> GetTopActiveCustomers(int count)
        {
            throw new NotImplementedException();
        }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
    }
}
