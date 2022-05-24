import Module from './Module.js';
export default class SSHClient extends Module {
    constructor() {
        super();
    }

    exec(commands) {
        const binary = 'ssh';
        const params = ['-o', 'StrictHostKeyChecking=no', '-i', `${SSH_CONTAINER_KEY}`, `${SSH_HOST_KEY_USER}@${SSH_HOST}`, `${commands.join(' ')}`];
        return this
            .command(binary, params)
            .then(tty => {
                return tty;
            });
    }
}