import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CountrySelect from '../components/CountrySelect/CountrySelectInput';
import { COUNTRIES } from '../types/country';

const baseProps = {
  value: '' as const,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  disabled: false,
};

describe('CountrySelect', () => {
  it('should renders a <select> element and doesnt allow free-text input', () => {
    render(<CountrySelect {...baseProps} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('should render all supported countries in the dropdown', () => {
    render(<CountrySelect {...baseProps} />);
    for (const country of Object.values(COUNTRIES)) {
      expect(screen.getByRole('option', { name: country.name })).toBeInTheDocument();
    }
  });

  it('should render a default placeholder option of "Select a country"', () => {
    render(<CountrySelect {...baseProps} />);
    expect(screen.getByRole('option', { name: 'Select a country' })).toBeInTheDocument();
  });

  it('should render an error message when error prop is provided', () => {
    render(<CountrySelect {...baseProps} error="Please select a country." />);
    expect(screen.getByRole('alert')).toHaveTextContent('Please select a country.');
  });
});
