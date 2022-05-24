export default class extends MODULECLASS {
    constructor(device) {
        super();
        this.label = "SYSTEM";
        this.device = device;
        LOG(this.device.label, this.label, 'INIT');
    }

    getAll() {

    }
}