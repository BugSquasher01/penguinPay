import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AmountToSendInput from '../components/AmountToSendInput/AmountToSendInput';

const baseProps = {
  value: '',
  onChange: vi.fn(),
  onBlur: vi.fn(),
  disabled: false,
};

describe('AmountToSendInput input filtering', () => {
  it('should strip decimal points before calling onChange', () => {
    const onChange = vi.fn();
    render(<AmountToSendInput {...baseProps} onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '10.55' } });
    expect(onChange).toHaveBeenCalledWith('1055');
  });

  it('should strip non-digit characters before calling onChange', () => {
    const onChange = vi.fn();
    render(<AmountToSendInput {...baseProps} onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '123aa' } });
    expect(onChange).toHaveBeenCalledWith('123');
  });

  it('should allow whole numbers through unchanged', () => {
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
});
