import { UseFormWatch } from "react-hook-form"
import FieldType from "../../types/field-type"

export function getSignupFields(errors: any, watch: UseFormWatch<any>): FieldType[] {
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
        },
        {
            name: 'confirmEmail', error: errors.confirmEmail, placeholder: 'confirmEmail@example.com', type: 'text',
            rules: {
                required: 'Confirm email is required',
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Invalid email address',
                },
                validate: {
                    matchesEmail: (value) =>
                    value === watch('email') || 'Emails do not match',
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
        {
            name: 'confirmPassword', error: errors.confirmPassword, placeholder: 'Confirm password (at least 8 characters)', type: 'password',
            rules: {
                required: 'Confirm password is required',
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
                validate: {
                    matchesPassword: (value) =>
                        value === watch('password') || 'Passwords do not match',
                },
            }
        },
        {
            name: 'firstname', error: errors.firstname, placeholder: 'Firstname', type: 'text',
            rules: {
                required: 'Firstname is required',
                minLength: {
                value: 3,
                message: 'Firstname must be at least 3 characters',
                },
                maxLength: {
                value: 16,
                message: 'Firstname must not exceed 16 characters',
                },
            }
        },
        {
            name: 'lastname', error: errors.lastname, placeholder: 'Lastname', type: 'text',
            rules: {
                required: 'Lastname is required',
                minLength: {
                value: 3,
                message: 'Lastname must be at least 3 characters',
                },
                maxLength: {
                value: 16,
                message: 'Lastname must not exceed 16 characters',
                },
            }
        },
    ]
}