import { render, screen, fireEvent } from '@testing-library/react';
import { PQRSList } from '..';

jest.mock('@/components/Button', () => ({
  Button: (props: any) => <button {...props}>{props.children}</button>
}));
jest.mock('@/components/Alert', () => ({
  Alert: (props: any) => <div data-testid="alert">{props.message}</div>
}));
jest.mock('@/components/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Cargando...</div>
}));

const pqrsMock = [
  {
    id: '1',
    title: 'Título PQRS',
    description: 'Descripción PQRS',
    status: { description: 'Pendiente' },
    type: { name: 'Petición' },
    createdAt: new Date().toISOString(),
    adminComment: 'Respuesta admin'
  }
];

describe('PQRSList', () => {
  const onPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra el spinner si loading es true', () => {
    render(
      <PQRSList
        pqrs={[]}
        loading={true}
        error={null}
        totalPages={1}
        currentPage={1}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('muestra el error si error existe', () => {
    render(
      <PQRSList
        pqrs={[]}
        loading={false}
        error="Error de carga"
        totalPages={1}
        currentPage={1}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByTestId('alert')).toHaveTextContent('Error de carga');
  });

  it('muestra mensaje de lista vacía si no hay PQRS', () => {
    render(
      <PQRSList
        pqrs={[]}
        loading={false}
        error={null}
        totalPages={1}
        currentPage={1}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByText('No hay PQRS registradas')).toBeInTheDocument();
    expect(screen.getByText('No se encontraron PQRS con los filtros seleccionados.')).toBeInTheDocument();
  });

  it('renderiza la lista de PQRS y muestra adminComment', () => {
    render(
      <PQRSList
        pqrs={pqrsMock as any}
        loading={false}
        error={null}
        totalPages={1}
        currentPage={1}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByText('Título PQRS')).toBeInTheDocument();
    expect(screen.getByText('Descripción PQRS')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('Petición')).toBeInTheDocument();
    expect(screen.getByText('Respuesta:')).toBeInTheDocument();
    expect(screen.getByText('Respuesta admin')).toBeInTheDocument();
  });

  it('muestra paginación y llama a onPageChange', () => {
  const onPageChange = jest.fn();

  const { rerender } = render(
    <PQRSList
      pqrs={pqrsMock as any}
      loading={false}
      error={null}
      totalPages={2}
      currentPage={2}
      onPageChange={onPageChange}
    />
  );
  expect(screen.getByText('Anterior')).toBeInTheDocument();
  expect(screen.getByText('Siguiente')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Anterior'));
  expect(onPageChange).toHaveBeenCalledWith(1);

  // Cambia la página actual a 1 y prueba el botón "Siguiente"
  rerender(
    <PQRSList
      pqrs={pqrsMock as any}
      loading={false}
      error={null}
      totalPages={2}
      currentPage={1}
      onPageChange={onPageChange}
    />
  );
  fireEvent.click(screen.getByText('Siguiente'));
  expect(onPageChange).toHaveBeenCalledWith(2);
});

  it('los botones de paginación se deshabilitan correctamente', () => {
    render(
      <PQRSList
        pqrs={pqrsMock as any}
        loading={false}
        error={null}
        totalPages={2}
        currentPage={1}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByText('Anterior')).toBeDisabled();
    expect(screen.getByText('Siguiente')).not.toBeDisabled();
  });
});