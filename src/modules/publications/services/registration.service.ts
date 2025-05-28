import apiClient from '@/lib/api/client';

export type Registration = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  publication: {
    id: string;
    title: string;
    description: string;
    type: {
      name: string;
      description: string;
    };
    date?: Date;
    location?: string;
  };
  registeredAt: Date;
}

export type EventRegistration = {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  isRegistered: boolean;
}

class RegistrationService {
  async registerToPublication(publicationId: string) {
    const { data } = await apiClient.post(`/registration/${publicationId}`);
    return data;
  }

  async cancelRegistration(publicationId: string) {
    const { data } = await apiClient.delete(`/registration/${publicationId}`);
    return data;
  }

  async getMyRegistrations() {
    const { data } = await apiClient.get('/registration/me');
    return data;
  }

  async isRegisteredToEvent(publicationId: string) {
    try {
      const registrations = await this.getMyRegistrations();
      return registrations.some((reg: Registration) => reg.publication.id === publicationId);
    } catch (error) {
      console.error('Error checking registration:', error);
      return false;
    }
  }
}

export const registrationService = new RegistrationService(); 