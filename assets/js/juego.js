const moduloJuego = (() => {
  ('use strict');
  /**
   * 2C = Dos de tréboles  (Clubs)
   * 2D = Dos de diamantes (Diamonds)
   * 2H = Dos de corazones (Hearts)
   * 2S = Dos de espadas   (Spades)
   */

  let deck = []; //baraja
  const tipos = ['C', 'D', 'H', 'S'], // Denominaciones de cartas
    cEspeciales = ['A', 'J', 'K', 'Q']; // Cartas especiales

  let puntosJugadores;

  //* Referencias HTML
  const puntosHTML = document.querySelectorAll('small'),
    divCartasJugadores = document.querySelectorAll('.divCartas');

  const btnNuevo = document.querySelector('#btnNuevo'),
    btnPedir = document.querySelector('#btnPedir'),
    btnDetener = document.querySelector('#btnDetener');

  /**
   * Ésta función inicializa el juego
   */
  const iniciarJuego = (numeroJugadores = 2) => {
    deck = crearDeck();
    puntosJugadores = [];

    for (let i = 0; i < numeroJugadores; i++) {
      puntosJugadores.push(0);
    }

    puntosHTML.forEach((elem) => (elem.innerText = 0));
    divCartasJugadores.forEach((elem) => (elem.innerHTML = ''));

    btnPedir.disabled = false;
    btnDetener.disabled = false;
  };

  const crearDeck = () => {
    deck = [];

    for (i = 2; i <= 10; i++) {
      for (tipo of tipos) {
        deck.push(i + tipo);
      }
    }

    for (especial of cEspeciales) {
      for (tipo of tipos) {
        deck.push(especial + tipo);
      }
    }

    //* Uso de librería underscore.js para barajar las cartas usando su método shuffle

    return _.shuffle(deck);
  };

  // Ésta función permite tomar una carta de la baraja
  const pedirCarta = () => {
    if (deck.length === 0) {
      throw 'No hay cartas en la baraja';
    }
    return deck.pop();
  };

  // pedirCarta();

  const valorCarta = (carta) => {
    const valor = carta.substring(0, carta.length - 1);

    // Valida si el valor de la carta NO es un número
    return isNaN(valor) ? (valor === 'A' ? 11 : 10) : valor * 1;
  };

  // Turno: 0 => Jugador 1 y el último valor del arreglo es el turno de la computadora
  const acumularPuntos = (carta, turno) => {
    puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
    puntosHTML[turno].innerText = puntosJugadores[turno];

    return puntosJugadores[turno];
  };

  // Éste método sirve para crear un elemento img agregarlo al div que contiene las cartas del jugador en turno
  const crearCarta = (carta, turno) => {
    const imgCarta = document.createElement('img');
    imgCarta.classList.add('carta');
    imgCarta.src = `assets/cartas/${carta}.png`;
    imgCarta.alt = '';
    divCartasJugadores[turno].append(imgCarta);
  };

  // Éste método determina quien fue el ganador
  const determinarVencedor = () => {
    const [puntosJug, puntosPc] = puntosJugadores;

    setTimeout(() => {
      if (puntosPc === puntosJug) {
        alert('Empate 💆 ');
      } else if (puntosJug > 21) {
        alert('Gana computadora 💻 ');
      } else if (puntosPc > 21) {
        alert('Jugador gana 🙋 ');
      } else {
        alert('Gana computadora 💻 ');
      }
    }, 30);
  };

  /**
   * Lógica que realiza el turno de la computadora
   * @param {number} puntosMinimos puntos realizados por el jugador
   */
  const turnoComputadora = (puntosMinimos) => {
    let puntosPc = 0;
    do {
      const carta = pedirCarta();
      puntosPc = acumularPuntos(carta, puntosJugadores.length - 1);

      crearCarta(carta, puntosJugadores.length - 1);

      if (puntosMinimos > 21) {
        break;
      }
    } while (puntosPc < puntosMinimos && puntosMinimos <= 21);

    determinarVencedor();
  };

  //* Eventos
  btnPedir.addEventListener('click', () => {
    const carta = pedirCarta();
    const puntosJugador = acumularPuntos(carta, 0);

    crearCarta(carta, 0);

    if (puntosJugador > 21) {
      console.warn('Lo siento mucho, perdiste 😔 ');
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(puntosJugador);
    } else if (puntosJugador === 21) {
      console.warn('21, genial ');
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(puntosJugador);
    }
  });

  btnDetener.addEventListener('click', () => {
    btnPedir.disabled = true;
    btnDetener.disabled = true;
    turnoComputadora(puntosJugadores[0]);
  });

  btnNuevo.addEventListener('click', () => {
    iniciarJuego();
  });

  return {
    nuevoJuego: iniciarJuego,
  };
})();
