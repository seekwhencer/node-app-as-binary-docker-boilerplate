export default class extends MODULECLASS {
    constructor(device) {
        super();
        this.label = "AUDIO OUTPUT";
        this.device = device;
        LOG(this.device.label, this.label, 'INIT');
    }

    getAll() {
        return SSH.exec(['aplay', '-l']).then(data => {
            LOG(this.device.label, this.label, 'EXEC:', data);
            this.parseData(data);
            return Promise.resolve(this.data);
        });
        // @TODO parse output
    }

    parseData(data) {
        const lines = data.split('\n');
        let matched;
        const cards = [];
        let index = 0;
        lines.forEach((line) => {
            matched = [...line.matchAll(new RegExp(/^card\s(.*),\s/, 'g'))];
            if (matched[0]) {
                LOG('>>>', matched[0].input);
                cards.push({
                    index: index,
                    input: matched[0].input
                });
                index++;
            }

        });
        LOG('>>>', cards);

        this.data = data;
    }
}