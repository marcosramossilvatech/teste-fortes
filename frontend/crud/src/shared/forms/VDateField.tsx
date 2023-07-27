import React, { useEffect, useState, ChangeEvent } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useField } from '@unform/core';
import moment from 'moment';

type DateFieldProps = TextFieldProps & {
  name: string;
};

export const VDateField: React.FC<DateFieldProps> = ({ name, ...rest }) => {
  const { fieldName, registerField, defaultValue, error, clearError } = useField(name);
  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultValue || null);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => selectedDate,
      setValue: (_, newValue) => setSelectedDate(newValue),
    });
  }, [selectedDate]);

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    console.log(value);
    console.log(parseDate(value));
    setSelectedDate(parseDate(value));
    if (rest.onChange) {
      rest.onChange(event);
    }
  };

  return (
    <TextField
      {...rest}
      type="date"
      error={!!error}
      helperText={error}
      value={selectedDate ? moment(selectedDate).utcOffset(-3).format('DD/MM/YYYY'): moment(parseDate((new Date()).toString())).utcOffset(-3).format('DD/MM/YYYY')}
      onChange={handleDateChange}
      onKeyDown={(e) => {
        error && clearError();
        rest.onKeyDown?.(e);
      }}
    />
  );
};

const parseDate = (value: string): Date | null => {
  if (!value) return null;

  const [year, month, day] = value.split('-').map((part) => parseInt(part, 10));
  return new Date(year, month - 1, day);
};
