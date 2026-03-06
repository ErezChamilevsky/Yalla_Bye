import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
    plugins: [
        basicSsl()
    ],
    server: {
        host: true, // This enables listening on all local IPs
    }
});
