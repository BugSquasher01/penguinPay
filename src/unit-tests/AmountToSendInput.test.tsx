import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AmountToSendInput from '../components/AmountToSendInput/AmountToSendInput';

const baseProps = {
  value: '',
  onChange: vi.fn(),
  onBlur: vi.fn(),
  disabled: false,
};

describe('AmountToSendInput input handling', () => {
  it('should pass a decimal value through unchanged instead of stripping the point', () => {
    const onChange = vi.fn();
    render(<AmountToSendInput {...baseProps} onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '10.55' } });
    // Must never transform a decimal into a larger whole-dollar value (e.g. "1055").
    expect(onChange).toHaveBeenCalledWith('10.55');
  });

  it('should pass invalid characters through unchanged so validation can flag them', () => {
    const onChange = vi.fn();
    render(<AmountToSendInput {...baseProps} onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '123aa' } });
    expect(onChange).toHaveBeenCalledWith('123aa');
  });

  it('should pass whole numbers through unchanged', () => {
    const onChange = vi.fn();
    render(<AmountToSendInput {...baseProps} onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '123' } });
    expect(onChange).toHaveBeenCalledWith('123');
  });

  it('should render a $ currency symbol', () => {
    render(<AmountToSendInput {...baseProps} />);
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('should render an error message when error prop is provided', () => {
    render(<AmountToSendInput {...baseProps} error="Amount is required." />);
    expect(screen.getByRole('alert')).toHaveTextContent('Amount is required.');
  });

  it('should render the correct error message when error prop is provided', () => {
    render(<AmountToSendInput {...baseProps} error="Amount must be a whole number of dollars (digits only, no decimals)." />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'amount-to-send-error');
  });
});
