import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { SERVICES } from '../data/services';
import { documentationHref, sectionHref, serviceHref } from '../services/router';
import type { Route } from '../types';
import { Icon } from './Icons';

/** Sections of the home page reachable from the navigation bar */
export const HOME_SECTIONS = [
  { id: 'funcionalidades', label: 'Funcionalidades' },
  { id: 'arquitectura', label: 'Arquitectura' },
  { id: 'tecnologias', label: 'Tecnologías' },
  { id: 'despliegue', label: 'Despliegue' },
  { id: 'equipo', label: 'Equipo' },
];

interface NavbarProps {
  route: Route;
}

/**
 * Scrolls to a home section again when its link is already the current route
 * @param event click on the link
 * @param href link of the section
 * @param sectionId identifier of the section
 */
function revisitSection(event: MouseEvent<HTMLAnchorElement>, href: string, sectionId: string): void {
  if (window.location.hash === href) {
    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Top navigation bar with the home sections, the services and the documentation
 * @param props current route
 * @returns the navigation bar
 */
export function Navbar({ route }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // The services menu closes with a click outside of it or with Escape
  useEffect(() => {
    if (!servicesOpen) {
      return undefined;
    }
    const onPointer = (event: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServicesOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [servicesOpen]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Every navigation closes the open menus
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [route.path]);

  const page = route.segments[0];
  let barClass = 'navbar';
  if (scrolled) {
    barClass += ' navbar-scrolled';
  }
  let linksClass = 'nav-links';
  if (menuOpen) {
    linksClass += ' nav-links-open';
  }
  let menuIcon: 'menu' | 'close' = 'menu';
  let menuLabel = 'Abrir menú';
  if (menuOpen) {
    menuIcon = 'close';
    menuLabel = 'Cerrar menú';
  }
  let servicesCurrent: 'page' | undefined;
  if (page === 'servicios') {
    servicesCurrent = 'page';
  }
  let documentationCurrent: 'page' | undefined;
  if (page === 'documentacion') {
    documentationCurrent = 'page';
  }

  return (
    <header className={barClass}>
      <div className="navbar-inner">
        <a className="brand" href="#/">
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" />
          <span>CampusSeguro</span>
        </a>
        <button
          type="button"
          className="icon-button nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          aria-label={menuLabel}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuIcon} />
        </button>
        <nav id="nav-links" className={linksClass} aria-label="Principal">
          {HOME_SECTIONS.map((section) => {
            const href = sectionHref(section.id);
            let current: 'location' | undefined;
            if (page === 'seccion' && route.segments[1] === section.id) {
              current = 'location';
            }
            return (
              <a
                key={section.id}
                href={href}
                aria-current={current}
                onClick={(event) => {
                  revisitSection(event, href, section.id);
                  setMenuOpen(false);
                }}
              >
                {section.label}
              </a>
            );
          })}
          <div className="nav-dropdown" ref={dropdownRef}>
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-current={servicesCurrent}
              onClick={() => setServicesOpen(!servicesOpen)}
            >
              Servicios
              <Icon name="chevron-down" />
            </button>
            {servicesOpen && (
              <div className="nav-menu">
                {SERVICES.map((service) => (
                  <a key={service.slug} href={serviceHref(service.slug)} onClick={() => setServicesOpen(false)}>
                    <span className="code-tag" style={{ background: service.accent }}>{service.code}</span>
                    <span>{service.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
          <a className="nav-cta" href={documentationHref()} aria-current={documentationCurrent}>
            Documentación
          </a>
        </nav>
      </div>
    </header>
  );
}
