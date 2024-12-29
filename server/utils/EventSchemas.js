const z = require("zod");

const eventSchema = z
  .object({
    name: z.string().min(1, "Name must have at least 1 character"),
    description: z.string().optional(),
    location: z.string().optional(),
    date: z
      .string()
      .refine((val) => {
        const inputDate = new Date(val);
        const currentDate = new Date();
        return inputDate >= currentDate; // Ensure the input date is not in the past
      }, "The date must be today or in the future")
      .refine(
        (val) => !isNaN(Date.parse(val)),
        "Date must be in a valid format (e.g., yyyy-mm-dd)"
      ),
    capacity: z.number().optional(),
  })
  .strict();

const updateSchema = z.object({
  name: z.string().min(1, "Name must have at least 1 character").optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  date: z
    .string()
    .refine((val) => {
      const inputDate = new Date(val);
      const currentDate = new Date();
      return inputDate >= currentDate;
    }, "The date must be today or in the future")
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "Date must be in a valid format (e.g., yyyy-mm-dd)"
    )
    .optional(),
});

module.exports = { eventSchema, updateSchema };
