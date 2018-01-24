namespace DAL.Models
{
    public class Customer : AuditableEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string City { get; set; }

        public string Address { get; set; }

        public string Country { get; set; }

        public string State { get; set; }       

        public bool Deleted { get; set; }

        public byte[] Picture { get; set; }

        //public string CreatedBy { get; set; }

        //public string UpdatedBy { get; set; }

        //public DateTime CreatedDate { get; set; }

        //public DateTime UpdatedDate { get; set; }
    }
}
