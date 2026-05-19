import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NameInput from '../components/NameInput/NameInput';

const baseProps = {
  id: 'firstName',
  label: 'First Name',
  value: '',
  onChange: vi.fn(),
  onBlur: vi.fn(),
  disabled: false,
};

describe('NameInput filtering', () => {
  it('should strip all numeric characters before calling onChange', () => {
    const onChange = vi.fn();
    render(<NameInput {...baseProps} onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Bobby1' } });
    expect(onChange).toHaveBeenCalledWith('Bobby');
  });

  it('should strip special characters before calling onChange', () => {
    const onChange = vi.fn();
    render(<NameInput {...baseProps} onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Bobby!' } });
    expect(onChange).toHaveBeenCalledWith('Bobby');
  });

  it('should allow letters and spaces through unchanged', () => {
    const onChange = vi.fn();
    render(<NameInput {...baseProps} onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Bobby Smith' } });
    expect(onChange).toHaveBeenCalledWith('Bobby Smith');
  });

  it('should render an error message when error prop is provided', () => {
    render(<NameInput {...baseProps} error="First name is required." />);
    expect(screen.getByRole('alert')).toHaveTextContent('First name is required.');
  });

  it('should not render an error message when error prop is absent', () => {
    render(<NameInput {...baseProps} />);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
