export default class extends MODULECLASS {
    constructor(device) {
        super();
        this.label = "NETWORK";
        this.device = device;
        LOG(this.device.label, this.label, 'INIT');
    }

    getAll() {
        return SSH.exec(['hostname']).then(data => {
            LOG(this.device.label, this.label, 'EXEC:', data);
            this.data = data;
            return Promise.resolve(data);
        });
    }
}