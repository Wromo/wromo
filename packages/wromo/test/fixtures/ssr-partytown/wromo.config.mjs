import { defineConfig } from 'wromo/config';
import partytown from '@wromojs/partytown';

// https://wromo.build/config
export default defineConfig({
	integrations: [partytown()],
});
