angular.module('App')
.controller('MainController', function($scope, $http){

	$scope.summonerId = "";
	$scope.games = [];
	$scope.errors = [];
	$scope.summonerNames = 'Gatuz Z, xxxhanqixxx, kira yasha, KsA SlicedOscar, Arkafloow';
	$scope.showErrors = false;
	$scope.ids = [];

	// Función para obtener el ID de los summoners
	$scope.fillSummonerId = function(){
		$scope.showErrors = false;
		// URL para obtener los datos del summoner, de acá le voy a sacar el ID para posteriormente
		// Llamar a la otra función y pasarle el summonerId.
		var url = 'https://lan.api.pvp.net/api/lol/lan/v1.4/summoner/by-name/' + $scope.summonerNames + '?api_key=86f763eb-7c6b-4e78-99da-30bfdb3bd4ce';
		$http.get(url).success(function(data){
			//Esto se va a ejecutar si la consulta es exitosa

			// Se vaiterando a través del resultado (un JSON), y a cada elemento del
			// JSON se le saca el ID, para luego, llamar a la función getData(). Esto
			angular.forEach(data, function(value, key){
				// Meto el id del jugador a un array (la verdad ni uso el array).
				$scope.ids.push(value.id);
				// Llamo a la función getData() para llenar la tabla del index con las
				// estadísticas del jugador, a la función se le pasa el summonerId del
				// jugador.
				$scope.getData(value.id);
			});
		}).error(function(error){
			//Esto se va a ejecutar si la consulta es erronea
			$scope.showErrors = true;
			$scope.errors = [];
			$scope.errors.push('No se pudieron descargar los datos');
		});
	}

	// Función para obtener las ultimas 10 partidas de un jugador
	$scope.getData = function(summonerId){
		if ( $scope.summonerNames.localeCompare("") != 0 ) {
			$scope.showErrors = false;
			
			// URL para obtener las últimas 10 partidas de un jugador
			var url = 'https://lan.api.pvp.net/api/lol/lan/v1.3/game/by-summoner/' + summonerId + '/recent?api_key=c4a41edf-94ea-40c6-894c-0f8e678829c9'
			console.log(url);
			$http.get(url).success(function(data){
				// Esto se va a ejecutar si lapeticion GET es exitosa :)

				// Se itera sobre el resultado devuelto por la consulta (un JSON con las
				// ultimass 10 partidas del jugador).
				angular.forEach(data.games, function(value, key) {
					// Se verifica que el tipo de juego sea CLASSIC, si lo es,
					// entonces se agrrega al array de games, el cuál posteriormente
					// ira llenando la tabla del index.
					if ( value.gameMode.localeCompare("CLASSIC") == 0 ) {
						$scope.rol = "default";
						switch( value.stats.playerPosition ){
							case 1:
								$scope.rol = "top";
								break;
							case 2:
								$scope.rol = "mid";
								break;
							case 3:
								$scope.rol = "jungle";
								break;
							case 4:
								if ( value.stats.playerRole == 2 ) {
									$scope.rol = "sup";
								}else{
									$scope.rol = "adc";
								}
								break;
						}

						// Este if es para guardar en el array solo los valores que tengan
						// value.stats.playerPosition.
						if ( value.stats.playerPosition != null ) {
							value.rol = $scope.rol;
							$scope.games.push(value);
						}
					}
			    });
				console.log($scope.games);
			}).error(function(error){
				// Esto se va a ejecutar si la petición GET no es exitosa :(
				$scope.showErrors = true;
				$scope.errors = [];
				$scope.errors.push('No se pudieron descargar los datos');
			});
		}else{
			// Muestra errores
			$scope.showErrors = true;
			$scope.errors.push('Ingrese el summonerId');
			console.log("Errores: " + $scope.errors);
		}
	};
});