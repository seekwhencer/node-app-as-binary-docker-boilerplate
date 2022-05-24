import Module from './Module.js';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';

export default class Config extends Module {
    constructor() {
        super();

        return new Promise((resolve, reject) => {
            this.label = 'CONFIG';
            this.configData = {};

            LOG(this.label, 'INIT');

            this.path = path.resolve(`${APP_DIR}/../config`);
            this.configFile = `${this.path}/${ENVIRONMENT}.conf`;
            this.typesFile = `${this.path}/types.json`;

            this.loadAppConfig()
                .then(() => {
                    this.mergeOverrides();
                    this.expandArrays();
                    this.convertTypes();
                    this.setConfigToGlobalScope();
                    this.postProcess();

                    LOG(this.label, 'LOADED');
                    resolve(this);
                });
        });
    }

    /**
     * load the config file
     * @returns {Promise<T>}
     */
    loadAppConfig() {
        return fs.readFile(this.configFile)
            .then(configData => {
                this.configData = dotenv.parse(configData);
            })
            .catch(err => {
                ERROR(this.label, err);
            });
    }

    /**
     * merge with environment variables
     */
    mergeOverrides() {
        Object.keys(this.configData).forEach(k => process.env[k] ? this.configData[k] = process.env[k] : false);
    }

    /**
     * expand comma separated values to an array
     */
    expandArrays() {
        const envKeys = Object.keys(this.configData);
        envKeys.forEach(k => {
            const split = this.configData[k].split(',');
            if (split.length > 1) {
                const arrayData = [];
                split.forEach(s => {
                    arrayData.push(s.trim());
                });
                this.configData[k] = arrayData;
            }
        });
    }

    /**
     * convert data types from string to boolean or integer (at the moment)
     */
    convertTypes() {
        const types = fs.readJsonSync(this.typesFile);
        types.boolean.forEach(t => this.configData[t] === 'true' ? this.configData[t] = true : this.configData[t] = false);
        types.int.forEach(t => this.configData[t] = parseInt(this.configData[t]));
    }

    setConfigToGlobalScope() {
        Object.keys(this.configData).forEach(k => global[k] = this.configData[k]);
    }

    postProcess() {
        global['SSH_CONTAINER_KEY'] = `${SSH_CONTAINER_KEY_FOLDER}/${PROJECT_NAME}-${SERVICE_NAME}-docker`;
    }

}
