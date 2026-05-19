import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ComponentProps } from 'react';
import PhoneNumberInput from '../components/PhoneNumberInput/PhoneNumberInput';

// typed as ComponentProps to get correct types for the props when spreading in the tests
const baseProps: ComponentProps<typeof PhoneNumberInput> = {
  value: '',
  countryCode: 'KE',
  onChange: vi.fn(),
  onBlur: vi.fn(),
  disabled: false,
};

describe('PhoneNumberInput input filtering', () => {
  it('should strip non-digit characters before calling onChange', () => {
    const onChange = vi.fn();
    render(<PhoneNumberInput {...baseProps} onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '07abc12' } });
    expect(onChange).toHaveBeenCalledWith('0712');
  });

  it('should allow only digits in the input through unchanged', () => {
    const onChange = vi.fn();
    render(<PhoneNumberInput {...baseProps} onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '712345678' } });
    expect(onChange).toHaveBeenCalledWith('712345678');
  });

  it('should be disabled when no country code is provided', () => {
    render(<PhoneNumberInput {...baseProps} countryCode="" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should show the correct country dial prefix when a country is selected', () => {
    render(<PhoneNumberInput {...baseProps} countryCode="KE" />);
    expect(screen.getByText('+254')).toBeInTheDocument();
  });

  it('should render an error message when error prop is provided', () => {
    render(<PhoneNumberInput {...baseProps} error="Phone number is required." />);
    expect(screen.getByRole('alert')).toHaveTextContent('Phone number is required.');
  });
});
