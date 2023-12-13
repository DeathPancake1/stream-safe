import FieldType from "../../types/field-type"

export function getSigninFields(errors: any): FieldType[] {
    return [
        {
            name: 'email', error: errors.email, placeholder: 'johndoe@example.com', type: 'text',
            rules: {
                required: 'Email is required',
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Invalid email address',
                },
            }
        },
        {
            name: 'password', error: errors.password, placeholder: 'Password (at least 8 characters)', type: 'password',
            rules: {
                required: 'Password is required',
                minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
                },
                maxLength: {
                value: 32,
                message: 'Password must not exceed 32 characters',
                },
                pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/,
                message: 'Must have uppercase,lowercase and num',
                },
            }
        },
    ]
}