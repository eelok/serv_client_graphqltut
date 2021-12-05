const db = require("../db");
const Job = {
  company: (job) => db.companies.get(job.companyId),
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
  createJob: (root, { input }, context) => {
    //check user authenticated
    if(!context.user){
      throw new Error("Unauthorize")
    }
    console.log('context: ', context);
    const jobId = db.jobs.create(input);
    return db.jobs.get(jobId);
  },
};

module.exports = { Job, Mutation };
