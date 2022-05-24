export default class extends MODULECLASS {
    constructor(device) {
        super();
        this.label = "AUDIO INPUT";
        this.device = device;
        LOG(this.device.label, this.label, 'INIT');
    }

    getAll() {
        return SSH.exec(['arecord', '-l']).then(data => {
            LOG(this.device.label, this.label, 'EXEC:', data);
            this.parseData(data);
            return Promise.resolve(this.data);
        });
    }

    parseData(data) {
        const matched = [...data.matchAll(new RegExp(/^card*$/,'g'))];
        LOG('>>>', JSON.stringify(matched));

        this.data = data;
    }
}