"use client";

import { useEffect, useState } from "react";
import { PublicationService } from "@/modules/publications/services/publication.service";
import { Spinner } from "@/components/Spinner";
import { Alert } from "@/components/Alert";
import { Badge } from "@/components/Badge";
import { Tag } from "@/components/Tag";
import { AttachmentPreviewModal } from "@/components/Attachment/AttachmentPreviewModal";
import { PaperClipIcon, CalendarIcon, LinkIcon, MapPinIcon, UserIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { registrationService } from '@/modules/publications/services/registration.service';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/Button";

export function PublicationDetail({ id }: { id: string }) {
  const [publication, setPublication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<any>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Cargar la publicación
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    PublicationService.getPublication(id)
      .then((pub) => {
        setPublication(pub);
      })
      .catch((err) => {
        setError(err.message || "Error al cargar la publicación")
      })
      .finally(() => setLoading(false));
  }, [id, user]);

  const isUserRegistered = !!publication?.registration;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!publication) {
    return <Alert type="error" message="No se encontró la publicación" />;
  }

  const handleRegister = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setRegLoading(true);
    setRegError(null);
    setRegSuccess(null);

    try {
      if (isUserRegistered) {
        await registrationService.cancelRegistration(id);
        setRegSuccess('Te has dado de baja exitosamente');
      } else {
        await registrationService.registerToPublication(id);
        setRegSuccess('¡Te has inscrito exitosamente!');
      }
      const pub = await PublicationService.getPublication(id);
      setPublication(pub);
    } catch (err) {
      setRegError(err instanceof Error ? err.message : 'Error al procesar la inscripción');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{publication.title}</h1>
        <p className="text-lg text-muted-foreground">{publication.description}</p>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">{publication.type.description}</Badge>
          {publication.tags?.map((tag: any) => (
            <Tag key={tag.id}>{tag.name}</Tag>
          ))}
        </div>
      </div>

      {/* Información adicional general */}
      <div className="mb-8 flex flex-col gap-2 text-base text-muted-foreground">
        {/* Fecha y lugar si existen (eventos u otros tipos) */}
        {publication.event?.date && (
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <span>{new Date(publication.event.date).toLocaleDateString()}</span>
          </div>
        )}
        {publication.event?.location && (
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            <span>{publication.event.location}</span>
          </div>
        )}
        {/* Enlace externo (ofertas, eventos, etc.) */}
        {publication.event?.registrationLink && (
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            <a
              href={publication.event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Link de registro
            </a>
          </div>
        )}
        {publication.offer?.external_link && (
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            <a
              href={publication.offer.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Enlace externo
            </a>
          </div>
        )}
        {/* Organizadores */}
        {publication.organizers && publication.organizers.length > 0 && (
          <div>
            <span className="font-medium">Organizadores: </span>
            {publication.organizers.map((org: any) => (
              <Badge key={org.id} variant="default" className="mr-2">{org.name}{org.acronym ? ` (${org.acronym})` : ''}</Badge>
            ))}
          </div>
        )}
        {/* Ciudades */}
        {publication.cities && publication.cities.length > 0 && (
          <div>
            <span className="font-medium">Ciudades: </span>
            {publication.cities.map((city: any) => (
              <Badge key={city.id} variant="info" className="mr-2">{city.name}</Badge>
            ))}
          </div>
        )}
        {/* Autor/publicado por */}
        {publication.published_by && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Publicado por:</span>
            <span>{publication.published_by.name}</span>
          </div>
        )}
      </div>

      {/* Contenido principal con clase tiptap */}
      <div className="tiptap max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: publication.content }} />
      </div>

      {/* Adjuntos */}
      {publication.attachments && publication.attachments.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Archivos adjuntos</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publication.attachments.map((attachment: any) => (
              <div
                key={attachment.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg border p-4 hover:bg-muted"
                onClick={() => setPreviewAttachment(attachment)}
              >
                <PaperClipIcon className="h-5 w-5" />
                <span className="truncate">{attachment.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón de inscripción solo para eventos */}
      {publication.type.name === 'event' && (
        <div className="mt-8">
          {user ? (
            isUserRegistered ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircleIcon className="h-5 w-5" />
                <span>Ya estás inscrito a este evento</span>
                <Button
                  onClick={handleRegister}
                  disabled={regLoading}
                  variant="outline"
                  className="ml-4"
                >
                  {regLoading ? 'Procesando...' : 'Cancelar inscripción'}
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleRegister}
                disabled={regLoading}
                className="w-full sm:w-auto"
              >
                {regLoading ? 'Inscribiendo...' : 'Inscribirse al evento'}
              </Button>
            )
          ) : (
            <Button
              onClick={() => router.push('/login')}
              className="w-full sm:w-auto"
            >
              Inicia sesión para inscribirte
            </Button>
          )}
          {regError && <Alert type="error" message={regError} />}
          {regSuccess && <Alert type="success" message={regSuccess} />}
        </div>
      )}

      {previewAttachment && (
        <AttachmentPreviewModal
          attachment={previewAttachment}
          onClose={() => setPreviewAttachment(null)}
        />
      )}
    </div>
  );
} 