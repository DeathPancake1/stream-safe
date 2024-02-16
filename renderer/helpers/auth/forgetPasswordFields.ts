import FieldType from "../../types/field-type"

export function getForgetPasswordFields(errors: any): FieldType[] {
    return [
        {
            name: 'email', error: errors.email, placeholder: 'email@example.com', type: 'text',
            rules: {
                required: 'Email is required',
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Invalid email address',
                },
            }
        }
    ]
}