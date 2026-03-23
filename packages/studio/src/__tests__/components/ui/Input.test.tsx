import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '../../../components/ui/Input';

// 每次测试后清理
afterEach(cleanup);

 describe('Input Component', () => {
  test('renders with default props', () => {
    render(<Input placeholder="Test Input" />);
    const inputElement = screen.getByPlaceholderText('Test Input');
    expect(inputElement).toBeInTheDocument();
  });

  test('renders with label', () => {
    render(<Input label="Test Label" placeholder="Test Input" />);
    const labelElement = screen.getByText('Test Label');
    const inputElement = screen.getByPlaceholderText('Test Input');
    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });

  test('renders with error message', () => {
    render(<Input label="Test Label" placeholder="Test Input" error="Test error message" />);
    const errorElement = screen.getByText('Test error message');
    expect(errorElement).toBeInTheDocument();
  });

  test('renders with default variant', () => {
    render(<Input variant="default" placeholder="Test Input" />);
    const inputElement = screen.getByPlaceholderText('Test Input');
    expect(inputElement).toBeInTheDocument();
  });

  test('renders with outline variant', () => {
    render(<Input variant="outline" placeholder="Test Input" />);
    const inputElement = screen.getByPlaceholderText('Test Input');
    expect(inputElement).toBeInTheDocument();
  });

  test('renders with sm size', () => {
    render(<Input size="sm" placeholder="Test Input" />);
    const inputElement = screen.getByPlaceholderText('Test Input');
    expect(inputElement).toBeInTheDocument();
  });

  test('renders with md size', () => {
    render(<Input size="md" placeholder="Test Input" />);
    const inputElement = screen.getByPlaceholderText('Test Input');
    expect(inputElement).toBeInTheDocument();
  });

  test('renders with lg size', () => {
    render(<Input size="lg" placeholder="Test Input" />);
    const inputElement = screen.getByPlaceholderText('Test Input');
    expect(inputElement).toBeInTheDocument();
  });

  test('renders with fullWidth', () => {
    render(<Input fullWidth placeholder="Test Input" />);
    const inputElement = screen.getByPlaceholderText('Test Input');
    expect(inputElement).toBeInTheDocument();
  });

  test('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input placeholder="Test Input" onChange={handleChange} />);
    const inputElement = screen.getByPlaceholderText('Test Input');
    fireEvent.change(inputElement, { target: { value: 'Test value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('renders with disabled state', () => {
    render(<Input placeholder="Test Input" disabled />);
    const inputElement = screen.getByPlaceholderText('Test Input');
    expect(inputElement).toBeDisabled();
  });
});