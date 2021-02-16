window.addEventListener('load', start);
document.addEventListener('keydown', teclaDown);
document.addEventListener('keyup', teclaUp);

let directionJogadorY; // Direção Y da nave
let directionJogadorX; // Direção X da nave
let jogoRodando;
let frames; // Esta variável vai receber o controle do loop principal
let jogador; // Esta variável vai receber o elemento html (div)
let velocidadeJogador;
let positionJogadorX; // posicionalmento x (salto em pixels)
let positionJogadorY; // posicionalmento y (salto em pixels)
let tamanhoTelaWidth;
let tamanhoTelaHeight;
let velocidadeTiro;
let contarBombas;
let painelContarBombas;
let bombasTotal;
let velocidadeBomba;
let vidaPlaneta;
let tempoCriaBombas;
let indiceExplosao;
let indiceSom;
let barraPlaneta;
let telaMsg;
let painelContBombas;

function start(){ // Esta função vai inicializar as variáveis globais e os componentes
	jogoRodando = false;

	// Tela
	tamanhoTelaHeight = window.innerHeight;
	tamanhoTelaWidth = window.innerWidth;

	// Jogador
	directionJogadorX = directionJogadorY = 0;
	positionJogadorX = tamanhoTelaWidth / 2; // Centro da tela na horizontal
	positionJogadorY = tamanhoTelaHeight / 2; // Centro da tela na vertical
	velocidadeJogador = velocidadeTiro = 5;
	jogador = document.getElementById('naveJogo'); // Div relacionada a nave do jogador
	jogador.style.top = positionJogadorY + 'px';
	jogador.style.left = positionJogadorX + 'px';

	//Conroles das combas
	contarBombas = 150;
	velocidadeBomba = 3;

	//Controles do planeta
	vidaPlaneta = 300;
	barraPlaneta = document.getElementById('barraPlaneta');
	barraPlaneta.style.width = vidaPlaneta + 'px';

	//Controles de explosões
	indiceExplosao = indiceSom = 0;

	//Telas
	telaMsg = document.getElementById('telaMsg');
	telaMsg.style.backgroundImage = "url('assets/intro.jpg')";
	telaMsg.style.display = 'block';
	let button = document.getElementById('btnJogar');
	button.addEventListener('click', restart);
	painelContBombas = document.getElementById('contBombas');
	painelContBombas.innerHTML = 'Contagem de Bombas: ' + contarBombas;
}

function restart(){
	bombasTotal = document.getElementsByClassName('bomba');
	let tamanho = bombasTotal.length;
	for (let i = 0; i < tamanho; i++) {
		if(bombasTotal[i]){
			bombasTotal[i].remove();
		}
	}
	telaMsg.style.display = 'none';
	clearInterval(tempoCriaBombas);
	cancelAnimationFrame(frames);
	vidaPlaneta = 300;
	positionJogadorX = tamanhoTelaWidth / 2;
	positionJogadorY = tamanhoTelaHeight / 2;
	jogador.style.top = positionJogadorY + 'px';
	jogador.style.left = positionJogadorX + 'px';
	contarBombas = 150;
	jogoRodando = true;
	tempoCriaBombas = setInterval(criarBombas, 1700);
	gameLoop();
}

function teclaDown(){ // Esta função vai capturar a tecla presionada e vai verificar qual tecla foi presionada
	let teclaPresionada = event.keyCode; // Captura de tecla
	if(teclaPresionada == 37){ // verificação de tecla
		directionJogadorX = -1; // PARA ESQUERDA
	}else if(teclaPresionada == 38){
		directionJogadorY = -1; // PARA CIMA
	}else if(teclaPresionada == 39){
		directionJogadorX = 1; // PARA DIREITA 
	}else if(teclaPresionada == 40){
		directionJogadorY = 1; // PARA BAIXO
	}else if(teclaPresionada == 32){ //  ESPAÇO
		atirar(positionJogadorX + 17, positionJogadorY);
	}
}

function teclaUp(){ // Esta função vai capturar a tecla que foi liberada e vai verificar qual tecla foi liberada
	let teclaPresionada = event.keyCode; // Captura de tecla
	if(teclaPresionada == 37){ // verificação de tecla
		directionJogadorX = 0;
	}else if(teclaPresionada == 38){
		directionJogadorY = 0;
	}else if(teclaPresionada == 39){
		directionJogadorX = 0;
	}else if(teclaPresionada == 40){
		directionJogadorY = 0;
	}
}

function gameLoop(){
	if(jogoRodando){
		// Funções de controle;
		controlaJogador();
		controleTiros();
		controlarBombas();
	}
	gerenciaGame();
	frames = requestAnimationFrame(gameLoop); // Recursividade
}

function controlaJogador(){ // Esta função vai calcular quantos pixels serão saltados e para qual direção 
	positionJogadorY += directionJogadorY * velocidadeJogador;
	positionJogadorX += directionJogadorX * velocidadeJogador;
	jogador.style.top = positionJogadorY + 'px';
	jogador.style.left = positionJogadorX + 'px';
}

function atirar(x, y){
	let tiro = document.createElement('div');
	let attr1 = document.createAttribute('class');
	let attr2 = document.createAttribute('style');
	attr1.value = 'tiroJogador';
	attr2.value = 'top: ' + y + 'px;' + 'left: ' + x + 'px';
	tiro.setAttributeNode(attr1);
	tiro.setAttributeNode(attr2);
	document.body.appendChild(tiro);
}

function controleTiros(){
	let tiros = document.getElementsByClassName('tiroJogador');
	let tamanho = tiros.length;
	for(let i = 0; i < tamanho; i++) {
		if(tiros[i]){
			let positionTiro = tiros[i].offsetTop;
			positionTiro -= velocidadeTiro;
			tiros[i].style.top = positionTiro + 'px';
			colisaoTiroBomba(tiros[i]);
			if(positionTiro < 0){
				tiros[i].remove();
			}
		}
	}
}

function criarBombas(){
	if(jogoRodando){
		let y = 0;
		let x = Math.random() * tamanhoTelaWidth;		
		let bomba = document.createElement('div');
		let attr1 = document.createAttribute('class');
		let attr2 = document.createAttribute('style');
		attr1.value = 'bomba';
		attr2.value = 'top: ' + y + 'px; left: ' + x + 'px;';
		bomba.setAttributeNode(attr1);
		bomba.setAttributeNode(attr2);
		document.body.appendChild(bomba);
		contarBombas--;
		painelContBombas.innerHTML="Contagem de Bombas: " + contarBombas;
	}
}

function controlarBombas(){
	bombasTotal = document.getElementsByClassName('bomba');
	let tamanho = bombasTotal.length;
	for (let i = 0; i < tamanho; i++) {
		if(bombasTotal[i]){
			let positionIndice = bombasTotal[i].offsetTop;
			positionIndice += velocidadeBomba;
			bombasTotal[i].style.top = positionIndice + 'px';
			if(positionIndice > tamanhoTelaHeight){
				vidaPlaneta -= 10;
				criarExplosao(2, bombasTotal[i].offsetLeft, null);
				bombasTotal[i].remove();
			}
		}
	}
}

function colisaoTiroBomba(tiro){
	let tamanho = bombasTotal.length;
	for (let i = 0; i < tamanho; i++){
		if(bombasTotal[i]){
			if(
				(
					(tiro.offsetTop <= (bombasTotal[i].offsetTop + 40)) &&
					((tiro.offsetTop + 6) >= bombasTotal[i].offsetTop)
				)
				&&
				(
					(tiro.offsetLeft <= (bombasTotal[i].offsetLeft + 24)) &&
					((tiro.offsetLeft + 6) >= (bombasTotal[i].offsetLeft))
				)
			){
				criarExplosao(1, bombasTotal[i].offsetLeft - 25, bombasTotal[i].offsetTop);
				bombasTotal[i].remove();
				tiro.remove();
			}
		}
	}
}

function criarExplosao(tipo, x, y){
	if(document.getElementById('explosao' + (indiceExplosao - 4))){
		document.getElementById('explosao' + (indiceExplosao - 4)).remove();
	}
	let explosao = document.createElement('div');
	let img = document.createElement('img');
	let som = document.createElement('audio');
	//div
	let attr1 = document.createAttribute('class');
	let attr2 = document.createAttribute('style');
	let attr3 = document.createAttribute('id');
	//img
	let attr4 = document.createAttribute('src');
	//audio
	let attr5 = document.createAttribute('src');
	let attr6 = document.createAttribute('id');
	
	attr3.value = 'explosao' + indiceExplosao;

	if(tipo == 1){
		attr1.value = 'explosaoAr';
		attr2.value = 'top: ' + y + 'px; left: ' + x + 'px;';
		attr4.value = 'assets/explosao_ar.gif?' + new Date();
	}else{
		attr1.value = 'explosaoChao';
		attr2.value = 'top: ' + (tamanhoTelaHeight - 57) + 'px; left: ' + (x - 17) + 'px;';
		attr4.value = 'assets/explosao_chao.gif?' + new Date();
	}
	attr5.value = 'assets/exp1.mp3?' + new Date();
	attr6.value = 'som' + indiceSom;
	explosao.setAttributeNode(attr1);
	explosao.setAttributeNode(attr2);
	explosao.setAttributeNode(attr3);
	img.setAttributeNode(attr4);
	som.setAttributeNode(attr5);
	som.setAttributeNode(attr6);
	explosao.appendChild(img);
	explosao.appendChild(som);
	document.body.appendChild(explosao);
	document.getElementById('som' + indiceSom).play();
	indiceExplosao++;
	indiceSom++;
}

function gerenciaGame(){
	barraPlaneta.style.width = vidaPlaneta + 'px';
	if(contarBombas <= 0){
		jogoRodando = false;
		clearInterval(tempoCriaBombas);
		telaMsg.style.backgroundImage = "url('assets/vitoria.jpg')";
		telaMsg.style.display = 'block';
	}
	if(vidaPlaneta <= 0){
		jogoRodando = false;
		clearInterval(tempoCriaBombas);
		telaMsg.style.backgroundImage = "url('assets/derrota.jpg')";
		telaMsg.style.display = 'block';
	}
}


