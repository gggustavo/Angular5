using AutoMapper;
using DAL;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using myApp.ViewModels;
using System.Collections.Generic;
using System.Linq;

namespace myApp.Controllers
{

    [Route("api/[controller]")]
    public class CustomerController : Controller
    {
        private IUnitOfWork _unitOfWork;
        readonly ILogger _logger;

        public CustomerController(IUnitOfWork unitOfWork, ILogger<CustomerController> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet]
        [HttpGet("customers")]
        public IActionResult Get()
        {
            var allCustomers = _unitOfWork.Customers.GetAllCustomersData();
            return Ok(Mapper.Map<IEnumerable<CustomerViewModel>>(allCustomers));
        }

        [HttpGet]
        [HttpGet("customers/{id}")]
        public IActionResult GetById(int id)
        {
            var customer = _unitOfWork.Customers.Find(_ => _.Id == id);
            return Ok(Mapper.Map<CustomerViewModel>(customer));
        }

        [HttpPost]
        [HttpPost("customers")]
        public IActionResult AddCustomer([FromBody] CustomerViewModel customer)
        {
            if (ModelState.IsValid)
            {
                if (customer == null)
                    return BadRequest($"{nameof(customer)} cannot be null");

                var appCustomer = Mapper.Map<Customer>(customer);
                _unitOfWork.Customers.Add(appCustomer);
                _unitOfWork.SaveChanges();
                return Ok(appCustomer);
            }

            return BadRequest(ModelState);                
        }

        [HttpPut("customers")]
        public IActionResult UpdateCustomer([FromBody] CustomerViewModel customer)
        {
            if (ModelState.IsValid)
            {
                if (customer == null)
                    return BadRequest($"{nameof(customer)} cannot be null");

                var appCustomer = Mapper.Map<Customer>(customer);
                _unitOfWork.Customers.Update(appCustomer);
                _unitOfWork.SaveChanges();
                return Ok(appCustomer);
            }

            return BadRequest(ModelState);
        }

        [HttpDelete("customers/{id}")]
        public IActionResult DeleteCustomer(int id)
        {
            var customer = _unitOfWork.Customers.Find(_ => _.Id == id).FirstOrDefault();
            customer.Deleted = true;
            _unitOfWork.Customers.Update(customer);
            _unitOfWork.SaveChanges();

            return Ok(customer);
            
        }


    }
}
