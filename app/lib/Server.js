import express from 'express';

export default class WebServer extends MODULECLASS {
    constructor() {
        super();
        return new Promise((resolve, reject) => {
            this.label = 'WEBSERVER';
            LOG(this.label, 'INIT');

            this.port = WEBSERVER_PORT || '3000';
            this.engine = express();

            this.engine.get('/', (req, res) => {
                res.send('Hello World!')
            })

            this.engine.listen(this.port, () => {
                LOG(this.label, 'IS LISTENING ON PORT:', this.port);
                resolve(this);
            })
        });
    }
}