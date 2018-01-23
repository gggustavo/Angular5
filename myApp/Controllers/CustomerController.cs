using AutoMapper;
using DAL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using myApp.ViewModels;
using System.Collections.Generic;

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
    }
}
