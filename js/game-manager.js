import stores from '../data/stores.js';

export class GameManager {
  coins = 10;
  storesOwned = [];
  lastTimePlayed = Date.now();

  constructor() {
    this.load(localStorage.getItem('game'));
  }
  
  get revenue() {
    if (this.storesOwned.length == 0) return 0;
    return Number(this.storesOwned.reduce((acc, s) => acc + (s.revenue), 0).toFixed(2));
  }

  getNewStoreValue() {
    const idx = this.storesOwned.length;
      const nxtStore = stores[idx];

      if (!nxtStore) return null;
      return nxtStore.cost;
  }

  buyStore(idx) {
    const store = this.storesOwned[idx];

    if (!store || store.cost > this.coins) return;
    this.coins -= store.cost;
    store.amount++;
    store.revenue = Number(store.revenue * (store.amount).toFixed(2));
    store.cost = Number((store.cost * (store.cost_mult**store.amount)).toFixed(2));
  }

  buyNewStore() {
    const store = { ...stores[this.storesOwned.length] };

    if (!store || store.cost > this.coins) return;
    this.coins -= store.cost;
    store.amount = 1;
    store.revenue = Number(store.revenue * (store.amount).toFixed(2));
    store.cost = Number((store.cost * (store.cost_mult**store.amount)).toFixed(2));
    this.storesOwned.push(store);
  }

  loop (delta) {
    this.coins += Number((this.revenue * delta).toFixed(2));
    this.lastTimePlayed = Date.now()
    localStorage.setItem('game', JSON.stringify(this));
  }

  reset() {
    this.coins = 10;
    this.storesOwned = [];
    this.lastTimePlayed = Date.now();
  }

  load(json) {
    const save = JSON.parse(json);
    if (save.coins) this.coins = save.coins;
    if (save.storesOwned) this.storesOwned = save.storesOwned;
    if (save.lastTimePlayed) this.coins += ((Date.now() - save.lastTimePlayed) / 1000) * this.revenue;
  }
}