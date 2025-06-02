export type WhatWeDoCard = {
  title: string;
  description: string;
  icon: 'UserGroupIcon' | 'LightBulbIcon' | 'EyeIcon' | 'ChatBubbleLeftRightIcon';
  color: 'primary' | 'secondary' | 'accent' | 'custom';
  className?: string;
};

export const whatWeDoCards: WhatWeDoCard[] = [
  {
    title: 'Representación y Participación',
    description:
      'Somos el mecanismo autónomo de participación, concertación, vigilancia y control de la gestión pública juvenil en Cali. Canalizamos las propuestas y necesidades de las juventudes ante las autoridades locales y nacionales.',
    icon: 'UserGroupIcon',
    color: 'primary',
  },
  {
    title: 'Articulación de Iniciativas',
    description:
      'Impulsamos procesos organizativos, proyectos y acciones que fortalecen el desarrollo integral de la juventud caleña, en temas como educación, salud, empleabilidad, cultura, derechos humanos, equidad de género, ambiente y más.',
    icon: 'LightBulbIcon',
    color: 'accent',
  },
  {
    title: 'Control Social y Veeduría',
    description:
      'Ejercemos veeduría a las políticas públicas y programas dirigidos a jóvenes, asegurando transparencia y cumplimiento de los acuerdos juveniles.',
    icon: 'EyeIcon',
    color: 'secondary',
  },
  {
    title: 'Espacio de Encuentro',
    description:
      'Cali Joven es un escenario abierto de diálogo, formación y construcción colectiva para todas las expresiones juveniles del Distrito.',
    icon: 'ChatBubbleLeftRightIcon',
    color: 'custom',
    className: 'border-l-4 border-purple-400',
  },
];
