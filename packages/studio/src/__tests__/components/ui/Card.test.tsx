import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../../../components/ui/Card';

 describe('Card Component', () => {
  test('renders with default props', () => {
    render(<Card>Card Content</Card>);
    const cardElement = screen.getByText('Card Content');
    expect(cardElement).toBeInTheDocument();
  });

  test('renders with custom className', () => {
    render(<Card className="custom-class">Card Content</Card>);
    const cardElement = screen.getByText('Card Content');
    expect(cardElement.closest('.custom-class')).toBeInTheDocument();
  });

  test('renders with Card.Header', () => {
    render(
      <Card>
        <Card.Header>Card Header</Card.Header>
        <Card.Content>Card Content</Card.Content>
      </Card>
    );
    const headerElement = screen.getByText('Card Header');
    const contentElement = screen.getByText('Card Content');
    expect(headerElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
  });

  test('renders with Card.Content', () => {
    render(
      <Card>
        <Card.Content>Card Content</Card.Content>
      </Card>
    );
    const contentElement = screen.getByText('Card Content');
    expect(contentElement).toBeInTheDocument();
  });

  test('renders with Card.Footer', () => {
    render(
      <Card>
        <Card.Content>Card Content</Card.Content>
        <Card.Footer>Card Footer</Card.Footer>
      </Card>
    );
    const contentElement = screen.getByText('Card Content');
    const footerElement = screen.getByText('Card Footer');
    expect(contentElement).toBeInTheDocument();
    expect(footerElement).toBeInTheDocument();
  });

  test('renders with all sections', () => {
    render(
      <Card>
        <Card.Header>Card Header</Card.Header>
        <Card.Content>Card Content</Card.Content>
        <Card.Footer>Card Footer</Card.Footer>
      </Card>
    );
    const headerElement = screen.getByText('Card Header');
    const contentElement = screen.getByText('Card Content');
    const footerElement = screen.getByText('Card Footer');
    expect(headerElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(footerElement).toBeInTheDocument();
  });
});