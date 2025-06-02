import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PublicationForm } from '../index';
import { mockPublication, mockUserOrganizations } from '@/modules/publications/mocks';
import { usePublicationForm } from '../hooks/usePublicationForm';
import { publicationTypes } from '@/lib/constants/publicationTypes';

// Mock del hook usePublicationForm
jest.mock('../hooks/usePublicationForm', () => ({
  usePublicationForm: jest.fn(),
}));

// Mock de los componentes de UI
jest.mock('@/components/Button', () => ({
  Button: ({ children, onClick, type, disabled, isLoading, variant, className }: any) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-testid={isLoading ? 'loading-button' : 'button'}
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/Alert', () => ({
  Alert: ({ type, message }: any) => (
    <div data-testid={`alert-${type}`} role="alert">
      {message}
    </div>
  ),
}));

jest.mock('@/components/Tabs', () => ({
  Tabs: ({ children, defaultValue }: any) => (
    <div data-testid="tabs" data-default-value={defaultValue}>
      {children}
    </div>
  ),
  TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children, value }: any) => (
    <button data-testid={`tab-trigger-${value}`}>{children}</button>
  ),
  TabsContent: ({ children, value }: any) => (
    <div data-testid={`tab-content-${value}`}>{children}</div>
  ),
}));

jest.mock('@/components/Toggle', () => ({
  Toggle: ({ label, checked, onChange }: any) => (
    <label>
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        data-testid="toggle"
      />
    </label>
  ),
}));

describe('PublicationForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();
  const defaultProps = {
    onSuccess: mockOnSuccess,
    onCancel: mockOnCancel,
    userOrganizations: mockUserOrganizations,
  };

  const defaultHookProps = {
    onSuccess: mockOnSuccess,
    defaultOrganizationId: '',
    userOrganizations: mockUserOrganizations,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (usePublicationForm as jest.Mock).mockReturnValue({
      formData: {
        title: '',
        description: '',
        content: '',
        type: publicationTypes.event.value,
        published: false,
        cities: [],
      },
      isLoading: false,
      error: null,
      success: null,
      attachments: [],
      selectedCities: [],
      offerTypes: [],
      attachmentsToDelete: [],
      selectedExistingTags: [],
      previewAttachment: null,
      fileInputRef: { current: null },
      newTagName: '',
      newTagDescription: '',
      handleSubmit: jest.fn((e) => e.preventDefault()),
      handleChange: jest.fn(),
      handleEventDataChange: jest.fn(),
      handleNewsDataChange: jest.fn(),
      handleOfferDataChange: jest.fn(),
      handleOrganizersChange: jest.fn(),
      handleCitySelect: jest.fn(),
      handleCityRemove: jest.fn(),
      handleExistingTagSelect: jest.fn(),
      handleExistingTagRemove: jest.fn(),
      handleCreateNewTag: jest.fn(),
      handleRemoveNewTag: jest.fn(),
      handleFileChange: jest.fn(),
      handleRemoveFile: jest.fn(),
      handleRemoveExistingAttachment: jest.fn(),
      handlePreviewFile: jest.fn(),
      handlePreviewExistingFile: jest.fn(),
      handleClosePreview: jest.fn(),
      setError: jest.fn(),
      setNewTagName: jest.fn(),
      setNewTagDescription: jest.fn(),
    });
  });

  it('renders create form correctly', () => {
    render(<PublicationForm {...defaultProps} />);

    expect(screen.getByText('Crear Nueva Publicación')).toBeInTheDocument();
    expect(screen.getByText('Completa la información para crear una nueva publicación')).toBeInTheDocument();
    expect(screen.getByText('📝 Básico')).toBeInTheDocument();
    expect(screen.getByText('⚙️ Detalles')).toBeInTheDocument();
    expect(screen.getByText('🏢 Organizaciones')).toBeInTheDocument();
    expect(screen.getByText('🌍 Ubicación')).toBeInTheDocument();
    expect(screen.getByText('📎 Archivos')).toBeInTheDocument();
  });

  it('renders edit form correctly', () => {
    const mockFormData = {
      title: mockPublication.title,
      description: mockPublication.description,
      content: mockPublication.content,
      type: publicationTypes.event.value,
      published: false,
      cities: [],
    };

    (usePublicationForm as jest.Mock).mockReturnValue({
      ...usePublicationForm(defaultHookProps),
      formData: mockFormData,
    });

    render(<PublicationForm {...defaultProps} publication={mockPublication} />);

    expect(screen.getByText('Editar Publicación')).toBeInTheDocument();
    expect(screen.getByText('Modifica los detalles de tu publicación existente')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const handleSubmit = jest.fn((e) => e.preventDefault());
    (usePublicationForm as jest.Mock).mockReturnValue({
      ...usePublicationForm(defaultHookProps),
      handleSubmit,
    });

    render(<PublicationForm {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /crear publicación/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  it('handles cancel button click', () => {
    render(<PublicationForm {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('displays error message when error exists', () => {
    const errorMessage = 'Test error message';
    (usePublicationForm as jest.Mock).mockReturnValue({
      ...usePublicationForm(defaultHookProps),
      error: errorMessage,
    });

    render(<PublicationForm {...defaultProps} />);
    
    expect(screen.getByTestId('alert-error')).toHaveTextContent(errorMessage);
  });

  it('displays success message when success exists', () => {
    const successMessage = 'Test success message';
    (usePublicationForm as jest.Mock).mockReturnValue({
      ...usePublicationForm(defaultHookProps),
      success: successMessage,
    });

    render(<PublicationForm {...defaultProps} />);
    
    expect(screen.getByTestId('alert-success')).toHaveTextContent(successMessage);
  });

  it('disables buttons when loading', () => {
    (usePublicationForm as jest.Mock).mockReturnValue({
      ...usePublicationForm(defaultHookProps),
      isLoading: true,
    });

    render(<PublicationForm {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /crear publicación/i });
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('handles publication settings toggle', () => {
    const handleChange = jest.fn();
    (usePublicationForm as jest.Mock).mockReturnValue({
      ...usePublicationForm(defaultHookProps),
      handleChange,
      formData: { published: false },
    });

    render(<PublicationForm {...defaultProps} />);
    
    const toggle = screen.getByTestId('toggle');
    fireEvent.click(toggle);

    expect(handleChange).toHaveBeenCalledWith('published', true);
  });
}); 