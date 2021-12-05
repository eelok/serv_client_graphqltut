const db = require("../db");
const Company = {
  jobs: (company) =>
    db.jobs.list().filter((job) => job.companyId === company.id),  
};

module.exports = { Company };

