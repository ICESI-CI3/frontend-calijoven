'use client';

import { useState } from 'react';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { Spinner } from '@/components/Spinner';
import { Textarea } from '@/components/Textarea';
import RequireAuth from '../../modules/auth/components/RequireAuth';
import { Badge } from '@/components/Badge';
import { Tag } from '@/components/Tag';
import { Avatar } from '@/components/Avatar';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [showAlert, setShowAlert] = useState(true);

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

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Badges</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-xl font-medium">Badge Variants</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="mb-2 text-xl font-medium">Badge Sizes</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="mb-2 text-xl font-medium">Badge Shapes</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge rounded="full">Rounded Full</Badge>
                  <Badge rounded="md">Rounded Medium</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="mb-2 text-xl font-medium">Use Cases</h3>
                <div className="space-y-2">
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-700">Status:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="success">Publicado</Badge>
                      <Badge variant="warning">Borrador</Badge>
                      <Badge variant="danger">Rechazado</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-700">Tipos de Publicación:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="primary">Noticia</Badge>
                      <Badge variant="info">Evento</Badge>
                      <Badge variant="warning">Oferta</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-700">Ciudades:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Cali</Badge>
                      <Badge>Bogotá</Badge>
                      <Badge>Medellín</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Tags</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-xl font-medium">Tag Colors</h3>
                <div className="flex flex-wrap gap-2">
                  <Tag color="default">Default</Tag>
                  <Tag color="primary">Primary</Tag>
                  <Tag color="success">Success</Tag>
                  <Tag color="warning">Warning</Tag>
                  <Tag color="danger">Danger</Tag>
                  <Tag color="info">Info</Tag>
                </div>
              </div>
              
              <div>
                <h3 className="mb-2 text-xl font-medium">Removable Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <Tag onRemove={() => alert('Tag removed')}>Removable</Tag>
                  <Tag color="primary" onRemove={() => alert('Primary tag removed')}>Primary</Tag>
                  <Tag color="success" onRemove={() => alert('Success tag removed')}>Success</Tag>
                </div>
              </div>
              
              <div>
                <h3 className="mb-2 text-xl font-medium">Clickable Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <Tag clickable onClick={() => alert('Default tag clicked')}>Clickable</Tag>
                  <Tag color="primary" clickable onClick={() => alert('Primary tag clicked')}>Primary</Tag>
                  <Tag 
                    color="info" 
                    clickable 
                    onClick={() => alert('Info tag clicked')}
                    onRemove={() => alert('Info tag removed')}
                  >
                    Click or Remove
                  </Tag>
                </div>
              </div>
              
              <div>
                <h3 className="mb-2 text-xl font-medium">Use Cases</h3>
                <div className="space-y-2">
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-700">Publication Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      <Tag color="primary">Educación</Tag>
                      <Tag color="primary">Juventud</Tag>
                      <Tag color="primary">Desarrollo</Tag>
                      <Tag color="primary" onRemove={() => {}}>Comunidad</Tag>
                    </div>
                  </div>
                  
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-700">Selectable Filters:</p>
                    <div className="flex flex-wrap gap-2">
                      <Tag color="default" clickable>Todas</Tag>
                      <Tag color="success" clickable>Activas</Tag>
                      <Tag color="warning" clickable>Pendientes</Tag>
                      <Tag color="danger" clickable>Rechazadas</Tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Avatars</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-xl font-medium">Avatar Sizes</h3>
                <div className="flex items-center gap-4">
                  <Avatar size="xs" name="Extra Small" />
                  <Avatar size="sm" name="Small Size" />
                  <Avatar size="md" name="Medium Size" />
                  <Avatar size="lg" name="Large Size" />
                  <Avatar size="xl" name="Extra Large" />
                </div>
              </div>
              
              <div>
                <h3 className="mb-2 text-xl font-medium">With Image</h3>
                <div className="flex items-center gap-4">
                  <Avatar 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User Profile"
                    size="md"
                  />
                  <Avatar 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User Profile"
                    size="lg"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="mb-2 text-xl font-medium">With Initials</h3>
                <div className="flex items-center gap-4">
                  <Avatar name="John Doe" size="md" />
                  <Avatar name="Alice Smith" size="md" />
                  <Avatar name="Robert Johnson" size="md" />
                  <Avatar name="Maria García" size="md" />
                  <Avatar name="Wei Zhang" size="md" />
                </div>
              </div>
              
              <div>
                <h3 className="mb-2 text-xl font-medium">Use Cases</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
                    <Avatar name="John Doe" size="lg" />
                    <div>
                      <div className="font-medium">John Doe</div>
                      <div className="text-sm text-gray-500">Administrator</div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="mb-4 flex items-center gap-3">
                      <Avatar name="Maria García" size="md" />
                      <div>
                        <div className="font-medium">Maria García</div>
                        <div className="text-xs text-gray-500">Posted 2 hours ago</div>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      This is a sample comment with an avatar. The avatar component automatically generates
                      initials and background colors based on the user's name when no image is provided.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
