import { GameManager } from "./game-manager.js";

var app = new Vue({
  el: '#app',
  data: {
    version: 0.1,
    game: new GameManager(),
    files: null,
    lastTime: 0,
    file: null,
    modalActive: false,
    loadError: false
  },
  methods: {
    buyStore(idx) {
      !idx && idx != 0 ? this.game.buyNewStore() : this.game.buyStore(idx);
    },
    getNewStoreValue() {
      return this.game.getNewStoreValue();
    },
    save() {
      let gameCopy = { ...this.game };
      delete gameCopy.lastTimePlayed;
      const blob = new Blob([JSON.stringify(this.game)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'game.json';
      a.click();
    },
    reset() {
      this.game.reset()
    },
    loop(delta, timestamp) {
      const lastTime = this.lastTime;
      this.lastTime = timestamp;
      this.game.loop(delta);
      requestAnimationFrame((time) => this.loop((time - lastTime)/1000, time));
    },
    format(number) {
      if (number == 0) return number;
      number = Number(number.toFixed(2));
      let exponent = Math.floor(Math.log10(number));
      exponent = exponent - exponent % 3;
      const remainder = Number((number / 10 ** exponent).toFixed(2));
      return `${remainder}${(exponent ? `e${exponent}` : '')}`;
    },
    getFiles(event) {
      this.file = event.target.files[0];
      this.loadError = false;
    },
    loadFile() {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        try {
          this.game.load(event.target.result);
          this.modalActive = false;
        } catch {
          this.loadError = true;
        }
        
      });
      reader.readAsText(this.file);
    }
  },
  mounted() {
    requestAnimationFrame((time) => {
      this.loop(time/1000, time)
    })
  }
})