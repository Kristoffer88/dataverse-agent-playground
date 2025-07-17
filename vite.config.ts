import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createDataverseConfig } from "dataverse-utilities/vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    
    const config = createDataverseConfig({
        dataverseUrl: env.VITE_DATAVERSE_URL,
    });

    return {
        ...config,
        plugins: [react(), ...config.plugins],
        server: {
            port: 5173,
            strictPort: false, // Allow fallback to other ports
            ...config.server,
        },
        test: {
            setupFiles: ['./tests/setup/setup.ts'],
            include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
            environment: 'jsdom',
        },
    };
});
