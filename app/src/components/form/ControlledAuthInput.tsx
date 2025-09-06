import React from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import AuthInput from '../AuthInput';

type Props<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

export default function ControlledAuthInput<T extends FieldValues>({ control, name, label, ...rest }: Props<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <AuthInput label={label} value={value ?? ''} onChangeText={onChange} error={error?.message} {...rest} />
            )}
        />
    );
}