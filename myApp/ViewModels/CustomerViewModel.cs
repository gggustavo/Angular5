using FluentValidation;

namespace myApp.ViewModels
{
    public class CustomerViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string City { get; set; }

        public string Address { get; set; }

        public string Country { get; set; }

        public string State { get; set; }
    }

    public class CustomerViewModelValidator : AbstractValidator<CustomerViewModel>
    {
        public CustomerViewModelValidator()
        {
            RuleFor(register => register.Name).NotEmpty().WithMessage("Customer name cannot be empty");
        }
    }
}
