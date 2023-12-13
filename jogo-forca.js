class Match {
  constructor(palavra) {
    this.palavra = palavra.toUpperCase();
    this.advinharLetra = [];
  }

  moverLetra(letra) {
    this.advinharLetra.push(letra.toUpperCase());
  }

  progresso() {
    let displaypalavra = '';
    this.palavra.split('').forEach(char => {
      if (this.advinharLetra.includes(char)) {
        displaypalavra += char + ' ';
      } else {
        displaypalavra += '_ ';
      }
    });
    return displaypalavra;
  }

  vitoria() {
    return this.palavra.split('').every(char => this.advinharLetra.includes(char));
  }

  derrota(tentativas) {
    return tentativas === 0;
  }
}

class Player {
  moverLetra(match, letra) {
    match.moverLetra(letra);
  }
}

class GameController {
  constructor() {
    this.match = null;
    this.player = new Player();
    this.maxTentativas = 6;
    this.tentativas = this.maxTentativas;
    this.rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  startGame() {
    console.log('Bem-vindo ao Jogo da Forca! \n');
    this.displayMenu();
  }

  displayMenu() {
    console.log('Escolha uma opção: \n');
    console.log('1. Iniciar Jogo');
    console.log('2. Encerrar Jogo \n');
    this.rl.question('Opção: ', option => {
      switch (option) {
        case '1':
          this.start();
          break;
        case '2':
          this.rl.close();
          break;
        default:
          console.log('Opção inválida.');
          this.displayMenu();
          break;
      }
    });
  }

  start() {
    this.rl.question('Digite uma palavra para começar o jogo: ', palavra => {
      if (!palavra.trim()) {
        console.log('Por favor, digite uma palavra válida.');
        this.start(); // Pede novamente para digitar a palavra
        return;
      }

      this.match = new Match(palavra);
      this.tentativas = this.maxTentativas;
      this.playGame();
    });
  }

  playGame() {
    console.log('Começou o jogo da forca! Adivinhe a palavra. \n');
    this.pergunta();
  }

  pergunta() {
    console.log(`\nPalavra: ${this.match.progresso()}`);
    console.log(`\nTentativas restantes: ${this.tentativas} \n`);
    this.rl.question('Digite uma letra:', letra => {
      if (!letra.match(/^[a-zA-Z]$/)) {
        console.log('Por favor, insira uma única letra. \n');
        this.pergunta();
        return;
      }
      this.player.moverLetra(this.match, letra);
      this.statusGame();
    });
  }

  statusGame() {
    if (this.match.vitoria()) {
      console.log(`\nParabéns! Você venceu! A palavra era: ${this.match.palavra} \n`);
      this.rl.close();
      return;
    }

    if (this.match.derrota(this.tentativas)) {
      console.log(`\nVocê perdeu! A palavra era: ${this.match.palavra} \n`);
      this.rl.close();
      return;
    }

    if (!this.match.palavra.includes(this.match.advinharLetra[this.match.advinharLetra.length - 1])) {
      this.tentativas--;
    }

    this.pergunta();
  }
}

const gameController = new GameController();
gameController.startGame();
