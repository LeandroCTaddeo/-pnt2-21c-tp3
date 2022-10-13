new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true;
            this.saludJugador = 100;
            this.saludMonstruo = 100;
        },
        atacar: function () {
            var damage = this.calcularHeridas(3, 10);
            this.saludMonstruo -=damage;
            this.turnos.unshift({
                esJugador: true,
                text: 'El jugador golpea al mounstro por ' + damage
            });
            if (this.verificarGanador()) {
                return;
            }
            this.ataqueDelMonstruo();
        },

        ataqueEspecial: function () {
            var damage = this.calcularHeridas(10, 20);
            this.saludMonstruo -= damage;
            this.turnos.unshift({
                esJugador: true,
                text: 'El jugador golpea al mounstro por ' + damage
            });

            if (this.verificarGanador()) {
                return;

            }
            this.ataqueDelMonstruo();

        },

        curar: function () {
            var damage = 10;
            if (this.saludJugador <= 90) {
              this.saludJugador += damage;
            } else {
              damage = 100 - this.saludJugador;
              this.saludJugador = 100;
            }
            this.registrarEvento({
              esJugador: true,
              text: `El jugador cura su salud en ${damage}%`,
            });
            this.ataqueDelMonstruo();
          },
          registrarEvento(evento) {
            this.turnos.unshift(evento);
          },

        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false;
            this.turnos = [];
        },

        ataqueDelMonstruo: function () {
            var damage = this.calcularHeridas(5, 12);
            this.saludJugador -= damage;
            this.turnos.unshift({
                esJugador: false,
                text: 'El mounstruo lastima al jugador en ' + damage
            });
            this.verificarGanador();

        },

        calcularHeridas: function (min, max) {
            return Math.max(Math.floor(Math.random() * max) + 1, min);
        },


        verificarGanador: function () {
                if (this.saludMonstruo <= 0) {
                  this.finDeLaPartida("Ganaste!");
                  return true;
                } else if (this.saludJugador <= 0) {
                  this.finDeLaPartida("Perdiste!");
                  return true;
                }
                return false;
              },

            finDeLaPartida: function (mensaje) {
                if (confirm(`${mensaje} Jugar de nuevo?`)) {
                    this.saludMonstruo = 100;
                    this.saludJugador = 100;
                    this.turnos = [];                   
                } else {
                    this.terminarPartida();
                }
            },
        
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});