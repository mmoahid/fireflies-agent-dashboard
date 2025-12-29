import tseslint from "typescript-eslint"

export default [
  { ignores: ["**/node_modules/**", "**/.next/**", "**/out/**", "**/build/**"] },
  ...tseslint.configs.recommended,
]

