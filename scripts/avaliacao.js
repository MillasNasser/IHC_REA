/* Globais */
var requisitos = "";
var linha_atual = 1;
var instrução_atual = 0;
var memória = [];

/* Script do javascript carrega antes do html, 
logo é necessário essa função carregar logo após a página 
ser carregada. Assim ela é chamada onload() */
function start_onload(){
	gera_tabela();
}

/* Função que gera as linhas laterais do código */
function insere_numeros_das_linhas(quantidade){
	/* Pega a referência do output e reseta seu valor */
	document.getElementById("LineNumbers").innerHTML = "";

	for (let i = 1; i <= quantidade; i++) {
		/* Para cada index é criado um div, seu valor é o index */
		var linha = document.createElement("div");
		linha.innerHTML = i;
		linha.id = "numero_" + i;

		/* Insere a nova div como filho do output */
		document.getElementById("LineNumbers").appendChild(linha);
	}

	//Identificando a primeira linha.
	linha_atual = requisitos["requisitos"][instrução_atual]["linha"];
	//ativar_instrução(linha_atual);
}

/* Função que gera a tabela de endereço */
function __inteiro_para_endereço(inteiro){
	return ("0000" + inteiro).slice(-4);
}

function __gera_stack_frame(funçãoChamadora, inicioContagem, qntLinhas, cor){
	
	var qntColunas = document.getElementById("MemHeader").children.length;
	
	for(let i = 0; i < qntLinhas; i++){
		/* Cria o elemento pai que receberá as colunas */
		var tr_linha = document.createElement("tr");
		tr_linha.style = "background-color: hsl("+cor+",100%,90%) !important;";
		tr_linha.className = funçãoChamadora;
		
		/* Gerando a coluna com o endereço */
		var td_endereço = document.createElement("td");
		td_endereço.className = "table-dark";
		td_endereço.innerHTML = __inteiro_para_endereço(i+inicioContagem);
		tr_linha.appendChild(td_endereço);
		
		/* Adicionando outras colunas */
		/* <Nome da variavel>;<valor>;<Valor no endereço>*/
		for(let colunas = 2; colunas <= qntColunas; colunas++){
			var td_col = document.createElement("td");
			td_col.className = "MCol" + (colunas);

			/*Criando o input que estará dentro da coluna */
			var input = document.createElement("input");
			input.type = "text";

			td_col.appendChild(input);
			tr_linha.appendChild(td_col);
		}

		document.getElementById("MemTabl").appendChild(tr_linha);
	}
}

function gera_tabela(){
	var funções = requisitos["funções"];
	var cor = 0; //Atributo hue na escala HSL
	var qnt_total_de_funções = 0;

	/* Gambi para pegar a quantidade de funções */
	Object.keys(funções).forEach(função => {
		qnt_total_de_funções++;
	});

	Object.keys(funções).forEach(função => {
		var inicio = funções[função]["inicio"];
		var fim = funções[função]["fim"];
		__gera_stack_frame(função,inicio,fim-inicio, cor);
		cor += 360/qnt_total_de_funções;
		habilita_celulas(função, false);
	});

	habilita_celulas("main", true);
}

/* Função que ativa e desativa as células que possui uma tag
igual ao nome da função que é passada por parâmetro */
function habilita_celulas(função, habilita){
	/* Pega a quantidade de colunas na tabela de memória */
	var qntColunas = document.getElementById("MemHeader").children.length;

	/* Pega todos os elementos que tem a tag de função */
	var elementos = document.getElementsByClassName(função);

	/* Para cada elemento com a tag função */
	for(let elemento = 0; elemento < elementos.length; elemento++){
		
		/* Pega-se a linha da tabela de memória */
		linha = elementos[elemento];

		/* E para cada colunha na linha e desativa o input */
		for(let filho = 1; filho < linha.children.length; filho++){
			this_filho = linha.children[filho];
			this_filho.children[0].disabled = !habilita;
		}
	}
}