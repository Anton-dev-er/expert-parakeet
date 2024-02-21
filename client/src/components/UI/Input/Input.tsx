import React, { FC, HTMLInputTypeAttribute, useEffect, useState } from 'react';
import styles from './Input.module.scss';

interface Input {
  onChange: (value: string) => void;
  id: string;
  validation?: {
    function: (value: string) => boolean;
    message: string;
  };
  type?: HTMLInputTypeAttribute | undefined;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
}

const Input: FC<Input> = ({
  id,
  onChange,
  label = '',
  disabled = false,
  type = 'text',
  validation,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    onChange(value);
    setValue(value);
  };

  const validateValue = () => {
    let isValid = true;
    if (validation) {
      isValid = validation?.function(value);
    }

    if (isValid) {
      setValue(value);
      setErrorMessage('');
    } else {
      setErrorMessage(validation?.message || '');
    }
  };

  useEffect(() => {
    validateValue();
  }, [value, validation?.message, validation?.function]);

  const handleOptions = () => {
    const newClasses = [];

    if (isFocus) {
      newClasses.push(styles.focus);
    }

    return newClasses.join(' ');
  };

  return (
    <div className={`${styles.input} ${handleOptions()}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        name={id}
        type={type}
        placeholder={''}
        disabled={disabled}
        onChange={handleOnChange}
        onFocus={() => {
          setIsFocus(true);
        }}
        onBlur={() => {
          if (!value) {
            setIsFocus(false);
          }
        }}
      />
      {errorMessage && <p>{errorMessage} *</p>}
    </div>
  );
};

export default Input;
