import '../../shared/lib/Utils.js';
import Module from '../../shared/lib/Module.js';
import SSHClient from '../../shared/lib/SSHClient.js';
import Package from '../package.json';
import path from 'path';
import * as Ramda from 'ramda';

process.env.DEBUG === 'true' ? global.DEBUG = true : global.DEBUG = false;
process.env.ENVIRONMENT ? global.ENVIRONMENT = process.env.ENVIRONMENT : global.ENVIRONMENT = 'default';
global.APP_DIR = path.resolve(process.env.PWD);

import Log from '../../shared/lib/Log.js';

global.LOG = new Log().log;
global.ERROR = new Log().error;

process.on('uncaughtException', error =>  LOG('ERROR:', error));
process.on('SIGINT', () => {
    try {
        // to some global things here
    } catch (e) {
        // ...
    }
    // some graceful exit code
    setTimeout(() => {
        process.exit(0);
    }, 500); // wait 2 seconds
});
process.stdin.resume();

global.PACKAGE = Package;
global.R = Ramda;
global.MODULECLASS = Module;
global.SSH = new SSHClient();
