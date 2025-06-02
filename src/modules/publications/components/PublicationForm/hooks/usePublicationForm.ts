import { useState, useEffect, useRef } from 'react';
import type {
  CreatePublicationDto,
  Publication,
  CreateTagDto,
  EventDto,
  NewsDto,
  OfferDto,
  UpdatePublicationDto,
} from '@/types/publication';
import { OrganizationDto } from '@/types/organization';
import { BaseCity } from '@/types/city';
import { publicationService } from '@/modules/publications/services/publication.service';
import { offerTypesService } from '@/lib/api/offerTypes.service';
import { publicationTypes } from '@/lib/constants/publicationTypes';

interface UsePublicationFormProps {
  publication?: Publication;
  defaultOrganizationId?: string;
  userOrganizations?: OrganizationDto[];
  onSuccess: () => void;
}

export function usePublicationForm({
  publication,
  defaultOrganizationId = '',
  onSuccess,
}: UsePublicationFormProps) {
  const [formData, setFormData] = useState<CreatePublicationDto>({
    title: '',
    description: '',
    content: '',
    type: 'news',
    tags: [],
    cities: [],
    organizers: defaultOrganizationId ? [defaultOrganizationId] : [],
    published: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedCities, setSelectedCities] = useState<BaseCity[]>([]);
  const [offerTypes, setOfferTypes] = useState<{ id: string; name: string }[]>([]);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<string[]>([]);
  const [selectedExistingTags, setSelectedExistingTags] = useState<{id: string, name: string, description?: string}[]>([]);
  const [previewAttachment, setPreviewAttachment] = useState<{url: string, name: string, format: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New tag creation states
  const [newTagName, setNewTagName] = useState('');
  const [newTagDescription, setNewTagDescription] = useState('');

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const offerTypesData = await offerTypesService.getOfferTypes();
        setOfferTypes(offerTypesData);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        setError('No se pudieron cargar algunos datos. Por favor, inténtalo de nuevo.');
      }
    };

    fetchInitialData();
  }, []);

  // Initialize form data when editing
  useEffect(() => {
    if (publication) {
      setFormData({
        title: publication.title,
        description: publication.description,
        content: publication.content,
        type: publication.type.name,
        cities: publication.cities.map((city) => city.id),
        tags: publication.tags.map((tag) => ({ name: tag.name, description: tag.description })),
        organizers: publication.organizers?.map((org) => org.id) || [],
        published: !!publication.published_at,
      });

      setSelectedCities(publication.cities);
      const existingTags = publication.tags.filter(tag => tag.id);
      setSelectedExistingTags(existingTags);

      if (publication.type.name === publicationTypes.event.value) {
        const eventData = publication.event || {};
        setFormData((prev) => ({
          ...prev,
          event: {
            location: eventData.location || '',
            date: eventData.date || '',
          },
        }));
      } else if (publication.type.name === 'news') {
        const newsData = publication.news || {};
        setFormData((prev) => ({
          ...prev,
          news: {
            author: newsData.author || '',
          },
        }));
      } else if (publication.type.name === 'offer') {
        const offerData = publication.offer || {};
        setFormData((prev) => ({
          ...prev,
          offer: {
            offerType: offerData.offerType || '',
            external_link: offerData.external_link || '',
            deadline: offerData.deadline || '',
          },
        }));
      }
    }
  }, [publication]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const submissionData: CreatePublicationDto | UpdatePublicationDto = {
        ...formData,
        attachments,
      };

      if (publication && attachmentsToDelete.length > 0) {
        (submissionData as UpdatePublicationDto).attachmentsToDelete = attachmentsToDelete;
      }

      if (submissionData.type === publicationTypes.event.value && submissionData.event?.date) {
        submissionData.event = {
          ...submissionData.event,
          date: submissionData.event.date,
        };
      }

      if (submissionData.type === publicationTypes.offer.value && submissionData.offer?.deadline) {
        submissionData.offer = {
          ...submissionData.offer,
          deadline: submissionData.offer.deadline,
        };
      }

      if (publication) {
        await publicationService.updatePublication(publication.id, submissionData as UpdatePublicationDto);
        setSuccess('Publicación actualizada exitosamente');
      } else {
        await publicationService.createPublication(submissionData as CreatePublicationDto);
        setSuccess('Publicación creada exitosamente');
      }

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CreatePublicationDto, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEventDataChange = (field: keyof EventDto, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      event: {
        ...(prev.event || {}),
        [field]: value,
      },
    }));
  };

  const handleNewsDataChange = (field: keyof NewsDto, value: string) => {
    setFormData((prev) => ({
      ...prev,
      news: {
        ...(prev.news || {}),
        [field]: value,
      },
    }));
  };

  const handleOfferDataChange = (field: keyof OfferDto, value: string) => {
    setFormData((prev) => ({
      ...prev,
      offer: {
        ...(prev.offer || {}),
        [field]: value,
      },
    }));
  };

  const handleOrganizersChange = (orgId: string) => {
    setFormData((prev) => {
      if (prev.organizers?.includes(orgId)) {
        return {
          ...prev,
          organizers: prev.organizers.filter(id => id !== orgId)
        };
      } else {
        return {
          ...prev,
          organizers: [...(prev.organizers || []), orgId]
        };
      }
    });
  };

  const handleCitySelect = (cityItem: { id: string; name: string; description?: string }) => {
    const city = { id: cityItem.id, name: cityItem.name } as BaseCity;
    setSelectedCities(prev => [...prev, city]);
    setFormData(prev => ({
      ...prev,
      cities: [...(prev.cities || []), city.id]
    }));
  };

  const handleCityRemove = (cityId: string) => {
    setSelectedCities(prev => prev.filter(city => city.id !== cityId));
    setFormData(prev => ({
      ...prev,
      cities: prev.cities?.filter(id => id !== cityId) || []
    }));
  };

  const handleExistingTagSelect = (tagItem: { id: string; name: string; description?: string }) => {
    const tag = { id: tagItem.id, name: tagItem.name, description: tagItem.description };
    setSelectedExistingTags(prev => [...prev, tag]);
  };

  const handleExistingTagRemove = (tagId: string) => {
    setSelectedExistingTags(prev => prev.filter(tag => tag.id !== tagId));
  };

  const handleCreateNewTag = () => {
    const newTag: CreateTagDto = {
      name: newTagName.trim(),
      description: newTagDescription.trim(),
    };

    setFormData((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), newTag],
    }));

    setNewTagName('');
    setNewTagDescription('');
  };

  const handleRemoveNewTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingAttachment = (id: string) => {
    setAttachmentsToDelete((prev) => [...prev, id]);
  };

  const handlePreviewFile = (file: File) => {
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPreviewAttachment({
        url,
        name: file.name,
        format: file.type
      });
    }
  };
  
  const handlePreviewExistingFile = (attachment: { id: string, name: string, format: string, url: string }) => {
    setPreviewAttachment({
      url: attachment.url,
      name: attachment.name,
      format: attachment.format
    });
  };

  const handleClosePreview = () => {
    if (previewAttachment?.url && !previewAttachment.url.startsWith('http')) {
      URL.revokeObjectURL(previewAttachment.url);
    }
    setPreviewAttachment(null);
  };

  return {
    // State
    formData,
    isLoading,
    error,
    success,
    attachments,
    selectedCities,
    offerTypes,
    attachmentsToDelete,
    selectedExistingTags,
    previewAttachment,
    fileInputRef,
    newTagName,
    newTagDescription,
    
    // Setters
    setError,
    setNewTagName,
    setNewTagDescription,
    
    // Handlers
    handleSubmit,
    handleChange,
    handleEventDataChange,
    handleNewsDataChange,
    handleOfferDataChange,
    handleOrganizersChange,
    handleCitySelect,
    handleCityRemove,
    handleExistingTagSelect,
    handleExistingTagRemove,
    handleCreateNewTag,
    handleRemoveNewTag,
    handleFileChange,
    handleRemoveFile,
    handleRemoveExistingAttachment,
    handlePreviewFile,
    handlePreviewExistingFile,
    handleClosePreview,
  };
}