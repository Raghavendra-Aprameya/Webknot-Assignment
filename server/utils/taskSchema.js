const z = require("zod");

const addSchema = z.object({
  name: z.string(),
  deadline: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "Date must be in a valid format (e.g., yyyy-mm-dd)"
    )
    .optional(),
});
const updateSchema = z.object({
  task_id: z.number(),
});

module.exports = { addSchema, updateSchema };
