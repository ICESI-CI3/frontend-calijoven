import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PQRSForm } from '..';
import PQRSService from '@/modules/pqrs/services/pqrs.service';

jest.mock('@/components/Button', () => ({
  Button: (props: any) => <button {...props}>{props.children}</button>
}));
jest.mock('@/components/Input', () => ({
  Input: (props: any) => (
    <input
      aria-label={props.label}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
    />
  )
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
jest.mock('@/components/Textarea', () => ({
  Textarea: (props: any) => (
    <textarea
      aria-label={props.label}
      value={props.value}
      onChange={e => props.onChange(e.target.value)}
      placeholder={props.placeholder}
      rows={props.rows}
    />
  )
}));
jest.mock('@/components/Alert', () => ({
  Alert: (props: any) => <div data-testid="alert">{props.message}</div>
}));
jest.mock('@/components/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Cargando...</div>
}));

jest.mock('@/modules/pqrs/services/pqrs.service');

const mockTypes = [
  { id: '1', name: 'Petición' },
  { id: '2', name: 'Queja' }
];

describe('PQRSForm', () => {
  const onSuccess = jest.fn();
  const onCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra el spinner mientras carga los tipos', async () => {
    (PQRSService.getPQRSTypes as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<PQRSForm onSuccess={onSuccess} onCancel={onCancel} />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('muestra error si falla la carga de tipos', async () => {
    (PQRSService.getPQRSTypes as jest.Mock).mockRejectedValue(new Error('fail'));
    render(<PQRSForm onSuccess={onSuccess} onCancel={onCancel} />);
    await waitFor(() => {
      expect(screen.getByTestId('alert')).toHaveTextContent('No se pudieron cargar los tipos de PQRS');
    });
  });

  it('renderiza el formulario y permite escribir', async () => {
    (PQRSService.getPQRSTypes as jest.Mock).mockResolvedValue(mockTypes);
    render(<PQRSForm onSuccess={onSuccess} onCancel={onCancel} />);
    await waitFor(() => {
      expect(screen.getByLabelText('Título')).toBeInTheDocument();
      expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
      expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Mi PQRS' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Descripción' } });
    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: '2' } });

    expect((screen.getByLabelText('Título') as HTMLInputElement).value).toBe('Mi PQRS');
    expect((screen.getByLabelText('Descripción') as HTMLTextAreaElement).value).toBe('Descripción');
    expect((screen.getByLabelText('Tipo') as HTMLSelectElement).value).toBe('2');
  });

  it('valida campos requeridos y muestra errores', async () => {
  (PQRSService.getPQRSTypes as jest.Mock).mockResolvedValue(mockTypes);
  render(<PQRSForm onSuccess={onSuccess} onCancel={onCancel} />);
  await waitFor(() => screen.getByLabelText('Título'));

  fireEvent.click(screen.getByText('Enviar PQRS'));
  await waitFor(() => {
    expect(screen.getByTestId('alert')).toHaveTextContent('El título es requerido');
  });

  fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Mi PQRS' } });
  fireEvent.click(screen.getByText('Enviar PQRS'));
  await waitFor(() => {
    expect(screen.getByTestId('alert')).toHaveTextContent('La descripción es requerida');
  });

    });
  it('envía el formulario correctamente y llama a onSuccess', async () => {
    (PQRSService.getPQRSTypes as jest.Mock).mockResolvedValue(mockTypes);
    (PQRSService.createPQRS as jest.Mock).mockResolvedValue({ id: '1' });
    render(<PQRSForm onSuccess={onSuccess} onCancel={onCancel} />);
    await waitFor(() => screen.getByLabelText('Título'));

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Mi PQRS' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Descripción' } });
    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: '1' } });
    fireEvent.click(screen.getByText('Enviar PQRS'));

    await waitFor(() => {
      expect(PQRSService.createPQRS).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('muestra error si falla el envío', async () => {
    (PQRSService.getPQRSTypes as jest.Mock).mockResolvedValue(mockTypes);
    (PQRSService.createPQRS as jest.Mock).mockRejectedValue(new Error('Error grave'));
    render(<PQRSForm onSuccess={onSuccess} onCancel={onCancel} />);
    await waitFor(() => screen.getByLabelText('Título'));

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Mi PQRS' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Descripción' } });
    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: '1' } });
    fireEvent.click(screen.getByText('Enviar PQRS'));

    await waitFor(() => {
      expect(screen.getByTestId('alert')).toHaveTextContent('Error grave');
    });
  });

  it('llama a onCancel al hacer click en cancelar', async () => {
    (PQRSService.getPQRSTypes as jest.Mock).mockResolvedValue(mockTypes);
    render(<PQRSForm onSuccess={onSuccess} onCancel={onCancel} />);
    await waitFor(() => screen.getByLabelText('Título'));
    fireEvent.click(screen.getByText('Cancelar'));
    expect(onCancel).toHaveBeenCalled();
  });
});