import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Textarea from '../../../components/ui/Textarea';

// 每次测试后清理
afterEach(cleanup);

 describe('Textarea Component', () => {
  test('renders with default props', () => {
    render(<Textarea placeholder="Test Textarea" />);
    const textareaElement = screen.getByPlaceholderText('Test Textarea');
    expect(textareaElement).toBeInTheDocument();
  });

  test('renders with label', () => {
    render(<Textarea label="Test Label" placeholder="Test Textarea" />);
    const labelElement = screen.getByText('Test Label');
    const textareaElement = screen.getByPlaceholderText('Test Textarea');
    expect(labelElement).toBeInTheDocument();
    expect(textareaElement).toBeInTheDocument();
  });

  test('renders with error message', () => {
    render(<Textarea label="Test Label" placeholder="Test Textarea" error="Test error message" />);
    const errorElement = screen.getByText('Test error message');
    expect(errorElement).toBeInTheDocument();
  });

  test('renders with default variant', () => {
    render(<Textarea variant="default" placeholder="Test Textarea" />);
    const textareaElement = screen.getByPlaceholderText('Test Textarea');
    expect(textareaElement).toBeInTheDocument();
  });

  test('renders with outline variant', () => {
    render(<Textarea variant="outline" placeholder="Test Textarea" />);
    const textareaElement = screen.getByPlaceholderText('Test Textarea');
    expect(textareaElement).toBeInTheDocument();
  });

  test('renders with sm size', () => {
    render(<Textarea size="sm" placeholder="Test Textarea" />);
    const textareaElement = screen.getByPlaceholderText('Test Textarea');
    expect(textareaElement).toBeInTheDocument();
  });

  test('renders with md size', () => {
    render(<Textarea size="md" placeholder="Test Textarea" />);
    const textareaElement = screen.getByPlaceholderText('Test Textarea');
    expect(textareaElement).toBeInTheDocument();
  });

  test('renders with lg size', () => {
    render(<Textarea size="lg" placeholder="Test Textarea" />);
    const textareaElement = screen.getByPlaceholderText('Test Textarea');
    expect(textareaElement).toBeInTheDocument();
  });

  test('renders with fullWidth', () => {
    render(<Textarea fullWidth placeholder="Test Textarea" />);
    const textareaElement = screen.getByPlaceholderText('Test Textarea');
    expect(textareaElement).toBeInTheDocument();
  });

  test('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Textarea placeholder="Test Textarea" onChange={handleChange} />);
    const textareaElement = screen.getByPlaceholderText('Test Textarea');
    fireEvent.change(textareaElement, { target: { value: 'Test value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('renders with disabled state', () => {
    render(<Textarea placeholder="Test Textarea" disabled />);
    const textareaElement = screen.getByPlaceholderText('Test Textarea');
    expect(textareaElement).toBeDisabled();
  });
});