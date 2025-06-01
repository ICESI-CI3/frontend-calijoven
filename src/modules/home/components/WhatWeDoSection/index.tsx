'use client';

import { whatWeDoCards, WhatWeDoCard } from '@/modules/home/constants/what-we-do-cards';
import {
  UserGroupIcon,
  EyeIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { Card } from '@/components/Card';

const iconMap = {
  UserGroupIcon: <UserGroupIcon className="h-7 w-7 text-primary" />,
  LightBulbIcon: <LightBulbIcon className="text-success h-7 w-7" />,
  EyeIcon: <EyeIcon className="text-warning h-7 w-7" />,
  ChatBubbleLeftRightIcon: <ChatBubbleLeftRightIcon className="h-7 w-7 text-accent" />,
};

export function WhatWeDoSection() {
  return (
    <section role="section" className="container mx-auto px-4 py-12">
      <h2 className="mb-2 text-center text-3xl font-bold text-foreground">¿Qué hacemos?</h2>
      <p className="mx-auto mb-10 max-w-3xl text-center text-lg text-muted-foreground">
        Somos el mecanismo de participación juvenil que conecta las voces jóvenes con las decisiones
        que transforman a Cali
      </p>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {whatWeDoCards.map((card: WhatWeDoCard) => (
          <Card
            key={card.title}
            title={card.title}
            description={card.description}
            icon={iconMap[card.icon]}
            color={card.color}
            className={card.className}
          />
        ))}
      </div>
    </section>
  );
}
