'use client';

import { useState, useEffect } from 'react';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { Spinner } from '@/components/Spinner';
import { Textarea } from '@/components/Textarea';
import RequireAuth from '../../modules/auth/components/RequireAuth';
import PublicationPreview from '@/modules/publications/components/PublicationPreview';
import { PublicationService } from '@/modules/publications/services/publication.service';
import { Publication } from '@/types/publication';

export default function Home() {
  // Estados para los componentes interactivos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [showAlert, setShowAlert] = useState(true);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        console.log('Fetching publications...');
        const data = await PublicationService.getPublications();
        console.log('Raw data received from PublicationService.getPublications:', data);
        console.log('Data being used to set publications state (data.data):', data.data);
        setPublications(data.data || []);
      } catch (err) {
        setError('Error al cargar las publicaciones');
        console.error('Error fetching publications:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublications();
  }, []);

  const selectOptions = [
    { value: 'option1', label: 'Opción 1' },
    { value: 'option2', label: 'Opción 2' },
    { value: 'option3', label: 'Opción 3' },
  ];

  return (
    <main className="flex-1 bg-background">
      <RequireAuth permissions={['MANAGE_PUBLICATION']} requireAll>
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-4xl font-bold">Bienvenido a la sección de administración</h1>
          <p className="text-lg text-muted-foreground">
            Aquí puedes gestionar los componentes de la plataforma.
          </p>
        </div>
      </RequireAuth>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-8 text-3xl font-bold">Componentes UI de Cali Joven</h1>

          {/* Sección de PublicationPreview */}
          <section className="mb-12 rounded-lg border border-gray-200 bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold">Vista previa de publicación</h2>
            {isLoading ? (
              <div className="flex justify-center">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <Alert type="error" message={error} />
            ) : publications.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {publications.map((publication) => (
                  <PublicationPreview key={publication.id} publication={publication} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No hay publicaciones disponibles</p>
            )}
          </section>

          {/* Sección de botones */}
          <section className="mb-12 rounded-lg border border-gray-200 bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold">Botones</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Botón Primario</Button>
              <Button variant="secondary">Botón Secundario</Button>
              <Button variant="outline">Botón Outline</Button>
              <Button variant="ghost">Botón Ghost</Button>
              <Button variant="danger">Botón Danger</Button>
              <Button isLoading>Botón Cargando</Button>
            </div>
          </section>

          {/* Sección de alertas */}
          <section className="mb-12 rounded-lg border border-gray-200 bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold">Alertas</h2>
            <div className="flex flex-col gap-4">
              <Alert type="success" message="Operación completada con éxito." />
              <Alert type="error" message="Ha ocurrido un error al procesar la solicitud." />
              <Alert type="warning" message="Advertencia: esta acción no se puede deshacer." />
              <Alert
                type="info"
                message="La plataforma estará en mantenimiento el día 15 de junio."
              />
              <Alert
                type="success"
                message="Esta alerta se puede cerrar."
                onClose={() => setShowAlert(false)}
                show={showAlert}
              />
              <Button
                onClick={() => setShowAlert(true)}
                size="sm"
                className="self-start"
                disabled={showAlert}
              >
                Mostrar alerta
              </Button>
            </div>
          </section>

          {/* Sección de inputs */}
          <section className="mb-12 rounded-lg border border-gray-200 bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold">Campos de entrada</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Input básico"
                placeholder="Escribe algo..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input
                label="Input con error"
                error="Este campo es requerido"
                placeholder="Escribe algo..."
              />
              <Input
                label="Input con texto de ayuda"
                helperText="Este campo es opcional"
                placeholder="Escribe algo..."
              />
              <Input label="Input deshabilitado" placeholder="No puedes escribir aquí" disabled />
              <Select
                label="Selector"
                options={selectOptions}
                value={selectValue}
                onChange={setSelectValue}
              />
              <Select
                label="Selector con error"
                options={selectOptions}
                value={selectValue}
                onChange={setSelectValue}
                error="Debes seleccionar una opción"
              />
              <Textarea
                label="Área de texto"
                placeholder="Escribe un mensaje..."
                value={textareaValue}
                onChange={setTextareaValue}
              />
              <Textarea
                label="Área de texto con error"
                placeholder="Escribe un mensaje..."
                error="El mensaje es demasiado corto"
              />
            </div>
          </section>

          {/* Sección de spinners */}
          <section className="mb-12 rounded-lg border border-gray-200 bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold">Indicadores de carga</h2>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center">
                <Spinner size="sm" />
                <span className="mt-2 text-sm">Pequeño</span>
              </div>
              <div className="flex flex-col items-center">
                <Spinner size="md" />
                <span className="mt-2 text-sm">Mediano</span>
              </div>
              <div className="flex flex-col items-center">
                <Spinner size="lg" />
                <span className="mt-2 text-sm">Grande</span>
              </div>
              <div className="flex flex-col items-center">
                <Spinner className="text-primary" size="md" />
                <span className="mt-2 text-sm">Color primario</span>
              </div>
            </div>
          </section>

          {/* Sección de modal */}
          <section className="mb-12 rounded-lg border border-gray-200 bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold">Modal</h2>
            <Button onClick={() => setIsModalOpen(true)}>Abrir Modal</Button>

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Ejemplo de Modal"
            >
              <div className="space-y-4">
                <p>Este es un ejemplo de un modal usando el componente Modal.</p>
                <Input label="Campo en modal" placeholder="Escribe algo..." />
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsModalOpen(false)}>Aceptar</Button>
                </div>
              </div>
            </Modal>
          </section>

          {/* Componentes en contexto */}
          <section className="rounded-lg border border-gray-200 bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold">Formulario de ejemplo</h2>
            <form className="space-y-6">
              <Input label="Nombre completo" placeholder="Ingresa tu nombre completo" required />
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  required
                />
                <Input label="Teléfono" type="tel" placeholder="(123) 456-7890" />
              </div>
              <Select
                label="Área de interés"
                options={[
                  { value: 'educacion', label: 'Educación' },
                  { value: 'empleo', label: 'Empleo' },
                  { value: 'cultura', label: 'Cultura y Deporte' },
                  { value: 'emprendimiento', label: 'Emprendimiento' },
                ]}
                value=""
                onChange={() => {}}
                helperText="Selecciona el área en la que estás más interesado"
              />
              <Textarea label="Mensaje" placeholder="Déjanos tu mensaje o consulta..." rows={5} />
              <div className="flex justify-end gap-4">
                <Button variant="outline" type="reset">
                  Cancelar
                </Button>
                <Button type="submit">Enviar</Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
