import Image from 'next/image';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

export type FooterLink = { name: string; href: string };

const quickLinks: FooterLink[] = [
  { name: 'Inicio', href: '/' },
  { name: 'Noticias', href: '/noticias' },
  { name: 'Eventos', href: '/eventos' },
  { name: 'PQRS', href: '/pqrs' },
];

const legalLinks: FooterLink[] = [
  { name: 'Términos y Condiciones', href: '/terminos' },
  { name: 'Política de Privacidad', href: '/privacidad' },
  { name: 'Política de Seguridad', href: '/seguridad' },
  { name: 'Transparencia', href: '/transparencia' },
  { name: 'Normatividad', href: '/normatividad' },
];

function FooterBranding() {
  return (
    <div>
      <div className="mb-2 flex flex-col items-start gap-3">
        <Image
          src="https://www.cali.gov.co/info/caligovco_se/media/bloque92622096.svg"
          alt="Logo Alcaldía de Cali"
          width={180}
          height={180}
          className="rounded bg-white p-1"
          priority
        />
        <div>
          <span className="text-lg font-bold text-primary-foreground">Alcaldía de Cali</span>
          <div className="text-sm text-primary-foreground/80">Plataforma Cali Joven</div>
        </div>
      </div>
      <p className="mb-4 text-sm text-primary-foreground/80">
        Plataforma oficial para políticas públicas y programas dirigidos a personas jóvenes.
      </p>
    </div>
  );
}

function FooterLinks({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-primary-foreground">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              className="text-primary-foreground/80 transition-colors hover:text-secondary"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterContact() {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-primary-foreground">Contacto</h3>
      <ul className="space-y-3 text-sm text-primary-foreground/80">
        <li className="flex items-start gap-2">
          <MapPinIcon className="h-5 w-5 flex-shrink-0 text-secondary" />
          <span>Calle 5 #12-34, Cali, Colombia</span>
        </li>
        <li className="flex items-start gap-2">
          <PhoneIcon className="h-5 w-5 flex-shrink-0 text-secondary" />
          <span>(602) 123-4567</span>
        </li>
        <li className="flex items-start gap-2">
          <EnvelopeIcon className="h-5 w-5 flex-shrink-0 text-secondary" />
          <span>contacto@calijoven.gov.co</span>
        </li>
        <li className="flex items-start gap-2">
          <ClockIcon className="h-5 w-5 flex-shrink-0 text-secondary" />
          <span>Lunes a Viernes: 8:00 AM - 5:00 PM</span>
        </li>
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <FooterBranding />
          <FooterLinks title="Enlaces Rápidos" links={quickLinks} />
          <FooterLinks title="Información Legal" links={legalLinks} />
          <FooterContact />
        </div>
        <hr className="my-8 border-primary-foreground/30" />
        <div className="text-center text-xs text-primary-foreground/60">
          © {year} Alcaldía de Santiago de Cali. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
