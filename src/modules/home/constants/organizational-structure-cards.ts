export type OrganizationalStructureCard = {
  title: string;
  description: string;
  icon: 'BuildingOffice2Icon' | 'UserGroupIcon';
  color: 'primary' | 'accent';
  className?: string;
  items?: string[];
};

export const organizationalStructureCards: OrganizationalStructureCard[] = [
  {
    title: 'Consejo Distrital de Juventud',
    description:
      'Integrado por 17 consejeros elegidos por voto popular, representantes de comunidades indígenas, afrocolombianas, víctimas y organizaciones juveniles.',
    icon: 'BuildingOffice2Icon',
    color: 'primary',
    items: [
      'Mesa Directiva (presidente, vicepresidentes, secretario)',
      'Comisiones especializadas',
      'Delegaciones territoriales',
    ],
  },
  {
    title: 'Plataforma Distrital de Juventudes',
    description:
      'Espacio de articulación de procesos y organizaciones juveniles del Distrito, con participación democrática y diversa.',
    icon: 'UserGroupIcon',
    color: 'accent',
    items: ['Asamblea General', 'Junta Directiva', 'Comisiones Estatutarias'],
  },
];
