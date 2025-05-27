'use client';

import {
  organizationalStructureCards,
  OrganizationalStructureCard,
} from '@/modules/home/constants/organizational-structure-cards';
import { BuildingOffice2Icon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/Card';

const iconMap = {
  BuildingOffice2Icon: <BuildingOffice2Icon className="h-7 w-7 text-blue-400" />,
  UserGroupIcon: <UserGroupIcon className="h-7 w-7 text-primary" />,
};

export function OrganizationalStructureSection() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="mb-2 text-center text-3xl font-bold">Estructura Organizativa</h2>
      <p className="mx-auto mb-10 max-w-3xl text-center text-lg text-muted-foreground">
        Conoce cómo está organizada la participación juvenil en Cali
      </p>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        {organizationalStructureCards.map((card: OrganizationalStructureCard) => (
          <Card
            key={card.title}
            title={card.title}
            description={card.description}
            icon={iconMap[card.icon]}
            color={card.color}
            className={card.className}
          >
            {card.items && (
              <ul className="mt-4 space-y-1">
                {card.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-base text-green-600">
                    <svg
                      className="h-5 w-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-base text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
