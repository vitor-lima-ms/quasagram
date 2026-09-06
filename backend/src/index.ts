import 'reflect-metadata';

import main from './infra/server.ts';
import './shared/index.ts';

export const QUASAGRAM_API = main();
