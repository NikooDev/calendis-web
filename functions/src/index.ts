import { setGlobalOptions } from 'firebase-functions';

setGlobalOptions({ maxInstances: 10, region: 'europe-west1', memory: '256MiB' });