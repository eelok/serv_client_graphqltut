const db = require("./db");
//todo не пойму что это за root
///job: (root, {id}) => db.jobs.get(id),
const Query = {
  job: (root, args) => db.jobs.get(args.id),
  jobs: () => db.jobs.list(),
  company: (root, { id }) => db.companies.get(id),
};
///когда делаю createJob для клиента неудобно солько много аргументов
// поэтому нужно сделать input
// const Mutation = {
//     createJob:(root, {companyId, title, description}) => {
//          const jobId = db.jobs.create({ companyId, title, description });
//          return db.jobs.get(jobId);
//     }
// }
const Mutation = {
  createJob: (root, { input }) => {
    const jobId = db.jobs.create(input);
    return db.jobs.get(jobId);
  },
};

const Job = {
  company: (job) => db.companies.get(job.companyId),
};

const Company = {
  jobs: (company) =>
    db.jobs.list().filter((job) => job.companyId === company.id),
};

module.exports = { Query, Job, Company, Mutation };
