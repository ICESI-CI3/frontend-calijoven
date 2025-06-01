import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PublicationsFilters from '../index';

// Mock de los componentes de UI
jest.mock('@/components/SearchInput', () => ({
  SearchInput: ({ onSearch, placeholder }: any) => (
    <input
      type="search"
      placeholder={placeholder}
      onChange={(e) => onSearch(e.target.value)}
      data-testid="search-input"
    />
  ),
}));

jest.mock('@/components/Select', () => ({
  Select: ({ options, value, onChange }: any) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-testid="organization-select"
    >
      {options.map((option: { value: string; label: string }) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock('@/components/Spinner', () => ({
  Spinner: () => <div data-testid="spinner" role="status" />,
}));

describe('PublicationsFilters', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnOrganizationChange = jest.fn();
  const defaultProps = {
    onSearchChange: mockOnSearchChange,
    organizationOptions: [
      { value: 'org1', label: 'Organización 1' },
      { value: 'org2', label: 'Organización 2' },
    ],
    selectedOrganization: 'org1',
    onOrganizationChange: mockOnOrganizationChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input', () => {
    render(<PublicationsFilters {...defaultProps} />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('handles search input change', () => {
    render(<PublicationsFilters {...defaultProps} />);
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('test');
  });

  it('renders organization select with options', () => {
    render(<PublicationsFilters {...defaultProps} />);
    const select = screen.getByTestId('organization-select');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Organización 1')).toBeInTheDocument();
    expect(screen.getByText('Organización 2')).toBeInTheDocument();
  });

  it('handles organization change', () => {
    render(<PublicationsFilters {...defaultProps} />);
    const select = screen.getByTestId('organization-select');
    fireEvent.change(select, { target: { value: 'org2' } });
    expect(mockOnOrganizationChange).toHaveBeenCalledWith('org2');
  });

  it('shows loading state for organizations', () => {
    render(<PublicationsFilters {...defaultProps} isLoadingOrganizations={true} />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
}); 