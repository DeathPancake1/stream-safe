import { UseFormWatch } from "react-hook-form"
import FieldType from "../../types/field-type"

export function getResetPasswordFields(errors: any, watch: UseFormWatch<any>): FieldType[] {
    return [
        {
            name: 'password', error: errors.password, placeholder: 'New Password (at least 8 characters)', type: 'password',
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
            name: 'confirmPassword', error: errors.confirmPassword, placeholder: 'Confirm New password (at least 8 characters)', type: 'password',
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
    
    ]}