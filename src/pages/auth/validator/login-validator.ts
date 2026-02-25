import * as v from "valibot";

export const loginValidator = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Email wajib diisi"),
    v.email("Format email tidak valid"),
  ),
  password: v.pipe(v.string(), v.minLength(1, "Password wajib diisi")),
  rememberMe: v.boolean(),
});

export type LoginValidatorType = v.InferOutput<typeof loginValidator>;
