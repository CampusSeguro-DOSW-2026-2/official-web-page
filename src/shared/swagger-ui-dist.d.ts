declare module 'swagger-ui-dist/swagger-ui-bundle.js' {
  interface SwaggerUiOptions {
    domNode: HTMLElement;
    url: string;
    deepLinking?: boolean;
    docExpansion?: 'list' | 'full' | 'none';
    defaultModelsExpandDepth?: number;
    displayRequestDuration?: boolean;
    filter?: boolean;
    supportedSubmitMethods?: string[];
    tryItOutEnabled?: boolean;
  }

  const SwaggerUIBundle: (options: SwaggerUiOptions) => unknown;
  export default SwaggerUIBundle;
}
