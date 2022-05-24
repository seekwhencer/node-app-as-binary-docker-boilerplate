import Units from './Units/index.js'

export default class Device extends MODULECLASS {
    constructor(parent) {
        super();
        this.label = "DEVICE";
        this.info = [];
        LOG(this.label, 'INIT');

        return new Promise((resolve, reject) => {
            this.audio = {
                input: new Units.AudioInputUnits(this),
                output: new Units.AudioOutputUnits(this)
            };
            this.system = new Units.SystemUnits(this);
            this.cpu = new Units.CPUUnits(this);
            this.network = new Units.NetworkUnits(this);

            // testing
            resolve(this);
        });
    }

    getAll() {
        return Promise.all([
            this.getAudio()
        ]);
    }

    getAudio() {
        return Promise.all([
            this.getAudioInput(),
            this.getAudioOutput()
        ]);
    }

    getAudioInput() {
        return this.audio.input.getAll();
    }
    getAudioOutput() {
        return this.audio.output.getAll();
    }
}