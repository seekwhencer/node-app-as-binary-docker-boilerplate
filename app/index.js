import './lib/Globals.js';
import Config from '../shared/lib/Config.js';
import Device from './lib/Device/index.js';
import WebServer from "./lib/Server.js";

new Config()
    .then(config => {
        global.CONFIG = config;
        return new Device();
    })
    .then(device => {
        global.DEVICE = device
        return new WebServer();
    })
    .then(webserver => {
        global.WEBSERVER = webserver;

        LOG('');
        LOG('//////////////////');
        LOG('RUNNING:', PACKAGE.name);
        LOG('VERSION:', PACKAGE.version);
        LOG('ENVIRONMENT:', ENVIRONMENT);
        LOG('/////////');
        LOG('');

        DEVICE.getAudioOutput();
    });

