const z = require("zod");

const addSchema = z.object({
  name: z.string().min(1, "Please keep it more than 1 character"),
});
module.exports = { addSchema };
