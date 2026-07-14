import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const googleVerification = env.GOOGLE_SITE_VERIFICATION?.trim();

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'inject-google-site-verification',
        transformIndexHtml(html) {
          if (!googleVerification || html.includes('google-site-verification')) {
            return html;
          }

          const safeToken = googleVerification.replace(/"/g, '&quot;');
          return html.replace(
            '</head>',
            `    <meta name="google-site-verification" content="${safeToken}" />\n  </head>`
          );
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
