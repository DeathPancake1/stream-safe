import { Control, FieldError, FieldValues, RegisterOptions } from "react-hook-form"

export default interface FieldType {
    name: string
    type: string
    error: FieldError
    placeholder: string
    rules: Omit<RegisterOptions<FieldValues, string>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">
}