import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { PQRSFilters } from '../index';

const getPQRSTypesMock = jest.fn();
const getPQRSTypeByIdMock = jest.fn();

jest.mock('../../../services/pqrs.service', () => ({
  PQRSService: {
    getPQRSTypes: (...args: any[]) => getPQRSTypesMock(...args),
    getPQRSTypeById: (...args: any[]) => getPQRSTypeByIdMock(...args),
  }
}));

jest.mock('@/components/Select', () => ({
  Select: (props: any) => (
    <select
      aria-label={props.label}
      value={props.value}
      onChange={e => props.onChange(e.target.value)}
    >
      {props.options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}));

const mockTypes = [
  { id: '1', name: 'Petición' },
  { id: '2', name: 'Queja' }
];

describe('PQRSFilters', () => {
  const onFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state', () => {
    getPQRSTypesMock.mockReturnValue(new Promise(() => {}));
    render(<PQRSFilters filters={{}} onFilterChange={onFilterChange} />);
    expect(screen.getByText('Cargando tipos de PQRS...')).toBeInTheDocument();
  });

  it('shows error state if loading types fails', async () => {
    getPQRSTypesMock.mockRejectedValue(new Error('fail'));
    render(<PQRSFilters filters={{}} onFilterChange={onFilterChange} />);
    await waitFor(() => {
      expect(screen.getByText('No se pudieron cargar los tipos de PQRS')).toBeInTheDocument();
    });
  });

  it('renders select and handles change', async () => {
    getPQRSTypesMock.mockResolvedValue(mockTypes);
    getPQRSTypeByIdMock.mockResolvedValue(mockTypes[1]);
    render(<PQRSFilters filters={{}} onFilterChange={onFilterChange} />);
    await waitFor(() => {
      expect(screen.getByLabelText('Tipo de PQRS')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Tipo de PQRS'), { target: { value: '2' } });
    await waitFor(() => {
      expect(getPQRSTypeByIdMock).toHaveBeenCalledWith('2');
      expect(onFilterChange).toHaveBeenCalledWith('type', mockTypes[1]);
    });
  });

  it('shows selected value if filter is provided', async () => {
    getPQRSTypesMock.mockResolvedValue(mockTypes);
    render(
      <PQRSFilters
        filters={{ type: { id: '2', name: 'Queja' } } as any}
        onFilterChange={onFilterChange}
      />
    );
    await waitFor(() => {
      expect((screen.getByLabelText('Tipo de PQRS') as HTMLSelectElement).value).toBe('2');
    });
  });
});