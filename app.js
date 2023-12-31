function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      battleLogs: [],
    };
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) return { width: "0%" };
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      if (this.playerHealth < 0) return { width: "0%" };
      return { width: this.playerHealth + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
    },
  },
  methods: {
    attackMonster() {
      const damage = getRandomValue(5, 12);
      this.monsterHealth -= damage;
      this.currentRound++;
      this.addLogMessage("player", "attack", damage);
      this.attackPlayer();
    },
    attackPlayer() {
      const damage = getRandomValue(8, 15);
      this.addLogMessage("monster", "attack", damage);
      this.playerHealth -= damage;
    },
    specialAttackMonster() {
      this.currentRound++;
      const damage = getRandomValue(10, 25);
      this.monsterHealth -= damage;
      this.addLogMessage("player", "attack", damage);
      this.attackPlayer();
    },
    healPlayer() {
      this.currentRound++;
      const health = getRandomValue(8, 20);
      if (this.playerHealth + health > 100) this.playerHealth = 100;
      else this.playerHealth += health;
      this.addLogMessage("player", "heal", health);
      this.attackPlayer();
    },
    startNewGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.currentRound = 0;
      this.battleLogs = [];
    },
    surrender() {
      this.winner = "monster";
    },
    addLogMessage(who, what, value) {
      this.battleLogs.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
