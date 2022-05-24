import * as si from 'systeminformation';
import SSHClient from '../../shared/lib/SSHClient.js';

export default class Gather extends MODULECLASS {
    constructor() {
        super();
        this.label = 'GATHER';

        this.options = {
            sections_available: ['audio', 'bluetoothDevices'],
            sections_used: GATHER_ALL_SECTIONS || ['audio', 'bluetoothDevices']
        };

        this.info = [];

        return new Promise((resolve, reject) => {
            LOG(this.label, 'INIT');
            this.ssh = new SSHClient();

            this
                .getAudioOutputDevices()
                .then(data => {
                    LOG(this.label, 'EXEC', data);
                    resolve(this);
                });
        });
    }

    getAudioOutputDevices() {
        return this.ssh.exec(['aplay', '-l']);
    }
    getAudioInputDevices() {
        return this.ssh.exec(['arecord', '-l']);
    }
}