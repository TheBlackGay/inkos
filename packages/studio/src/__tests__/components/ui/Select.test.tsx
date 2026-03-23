import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Select from '../../../components/ui/Select';

 describe('Select Component', () => {
  test('renders with default props', () => {
    render(
      <Select>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const selectElement = screen.getByDisplayValue('Option 1');
    expect(selectElement).toBeInTheDocument();
  });

  test('renders with label', () => {
    render(
      <Select label="Test Label">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const labelElement = screen.getByText('Test Label');
    expect(labelElement).toBeInTheDocument();
  });

  test('renders with error message', () => {
    render(
      <Select label="Test Label" error="Test error message">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const errorElement = screen.getByText('Test error message');
    expect(errorElement).toBeInTheDocument();
  });

  test('renders with default variant', () => {
    render(
      <Select variant="default">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const selectElement = screen.getByDisplayValue('Option 1');
    expect(selectElement).toBeInTheDocument();
  });

  test('renders with outline variant', () => {
    render(
      <Select variant="outline">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const selectElement = screen.getByDisplayValue('Option 1');
    expect(selectElement).toBeInTheDocument();
  });

  test('renders with sm size', () => {
    render(
      <Select size="sm">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const selectElement = screen.getByDisplayValue('Option 1');
    expect(selectElement).toBeInTheDocument();
  });

  test('renders with md size', () => {
    render(
      <Select size="md">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const selectElement = screen.getByDisplayValue('Option 1');
    expect(selectElement).toBeInTheDocument();
  });

  test('renders with lg size', () => {
    render(
      <Select size="lg">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const selectElement = screen.getByDisplayValue('Option 1');
    expect(selectElement).toBeInTheDocument();
  });

  test('renders with fullWidth', () => {
    render(
      <Select fullWidth>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const selectElement = screen.getByDisplayValue('Option 1');
    expect(selectElement).toBeInTheDocument();
  });

  test('handles value changes', () => {
    const handleChange = jest.fn();
    render(
      <Select onChange={handleChange}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const selectElement = screen.getByDisplayValue('Option 1');
    fireEvent.change(selectElement, { target: { value: '2' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('renders with disabled state', () => {
    render(
      <Select disabled>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const selectElement = screen.getByDisplayValue('Option 1');
    expect(selectElement).toBeDisabled();
  });
});