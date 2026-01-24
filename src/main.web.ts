import { WebAdapter } from './adapters/web';
import { startApp } from './main';

const adapter = new WebAdapter();
startApp(adapter).catch(console.error);
