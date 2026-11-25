import { Footer } from '../shared/components/Footer';
import { Navbar } from '../shared/components/Navbar';
import { useRoute } from '../shared/hooks/useRoute';
import { documentationRoutes } from '../modules/documentation/routes';
import { homeRoutes } from '../modules/home/routes';
import { serviceRoutes } from '../modules/service/routes';
import '../shared/styles.css';

/**
 * Page shown when the route does not exist
 * @returns the not found page
 */
function NotFound() {
  return (
    <section className="not-found">
      <span className="eyebrow">Error 404</span>
      <h1>Esta página no existe</h1>
      <p>Es posible que el enlace esté incompleto o que la página se haya movido.</p>
      <a className="button button-primary" href="#/">Volver al inicio</a>
    </section>
  );
}

/**
 * Shell of the site: navigation bar, page of the current route and footer
 * @returns the whole site
 */
export default function App() {
  const route = useRoute();
  const page = homeRoutes(route)
    ?? serviceRoutes(route)
    ?? documentationRoutes(route)
    ?? <NotFound />;

  return (
    <>
      <a className="skip-link" href="#contenido" onClick={(event) => {
        event.preventDefault();
        document.getElementById('contenido')?.focus();
      }}>
        Saltar al contenido
      </a>
      <Navbar route={route} />
      <main id="contenido" tabIndex={-1}>
        {page}
      </main>
      <Footer />
    </>
  );
}
