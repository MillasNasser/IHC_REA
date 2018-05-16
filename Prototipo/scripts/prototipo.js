//https://stackoverflow.com/a/6714233
String.prototype.replaceAll = function(str1, str2, ignore){
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

/* Variáveis globais */
var linhas_iniciais = 1;
var endereços_iniciais = 14;
var indentação_padrão = 4;

class Instrução{
	constructor(texto){
		this.set_texto(texto);
		this.parse_requisitos();
	}

	set_texto(texto){
		//Removendo um possível '\n' ao final da linha.
		this.texto = texto.replace("\n", "");
	}

	parse_requisitos(){
		//Zerando o número de requisitos.
		this.requisitos = [];

		var texto = this.texto;
	}
}

class Codigo{
	constructor(nome){
		this.reset(nome);
	}
	
	reset(nome){
		this.nome = nome;
		this.instruções = [];
	}
}

/*class Célula{
	constructor(enredeço){
		this.endereço = enredeço; //Talvez não seja necessário.
		this.nome = "";
		this.valor = "";
		this.ponteiro = false;
		this.desreferenciado = "";
	}
}*/

/* Variáveis globais */
var g_codigo = new Codigo();
//var memórias = [[]];
var linha_atual = 0;
var instrução_atual = 0; //Pode ter mais de uma instrução por linha.

function Start() {
	genLinesNum(linhas_iniciais);
	genAddressNum(endereços_iniciais);
}

/* Cria um numero hexadecimal e o formata para 4 digitos */
function int_to_endereço(i){
	var hexNum = (i).toString(16).toUpperCase();
	return ("0000" + hexNum).slice(-4);
}

/* Função que gera as linhas laterais do código */
function genLinesNum(qnt) {
	/* Pega a referência do output e reseta seu valor */
	document.getElementById("LineNumbers").innerHTML = "";
	for (let i = 0; i < qnt; i++) {
		/* Para cada index é criado um div, seu valor é o index */
		var linha = document.createElement("div");
		linha.innerHTML = i;
		linha.id = "numero_" + i;

		/* Insere a nova div como filho do output */
		document.getElementById("LineNumbers").appendChild(linha);
	}
}

/* Função que gera a tabela de endereços */
function genAddressNum(qntLin) {
	/* Calcula qual é a quantidade de colunas na tabela */
	var qntCol = document.getElementsByClassName("MemHeader")[0].children.length;
	
	for (let i = 0; i < qntLin; i++) {
		/* Cria uma div pai que receberá as colunas */
		var parent = document.createElement("tr");

		/* Primeira coluna, endereços gerados */
		var div = document.createElement("td");
		div.className = "MCol1 Dark-Base";
		div.innerHTML = "0x" + int_to_endereço(i * 4);
		/* Adiciona ao pai */
		parent.appendChild(div);

		/* Cria a segunda coluna até a quantidade de colunas 
		   Todas elas possui um filho input */
		for(let i = 2; i <= qntCol; i++){
			/* Cria a coluna */
			var div = document.createElement("td");
			div.className = "MCol"+(i);

			/* Cria o filho input */
			var input = document.createElement("input");
			input.type = "text";

			/* Adiciona o filho a coluna */
			div.appendChild(input);

			/* Adiciona a coluna ao pai */
			parent.appendChild(div);
		}

		/* Adiciona o pai à tabela de memória */
		document.getElementById("MemTabl").appendChild(parent);
	}
}

function set_codigo(){
	/* Cria a referência do output para o codigo lido */
	var Code = document.getElementById("Code");
	/* Reseta seu valor */
	Code.innerHTML = "";

	/* Para cada instrução */
	var linha = 0;
	g_codigo.instruções.forEach(instrução => {
		/* Cria uma tag que exibe o texto como foi escrito 
		   A tag é chamada de pre */
		var pre = document.createElement("pre");
		pre.className = "prettyprint prettyprinted";
		pre.id = "linha_" + linha;
		linha++;

		/* Chama o formatador de código para a linha atual 
		   A linguagem utilizada para formatar é C
		   '<' é substituido por "&lt" para ser exibido corretamente na página */
		pre.innerHTML = PR.prettyPrintOne(" "+instrução.texto.replace("<", "&lt;"), "C", true);

		/* Adiciona a linha ao output */
		Code.appendChild(pre);
	});

	/* Gera as linhas laterais de acordo o numero de linhas do arquivo */
	genLinesNum(g_codigo.instruções.length);

	/* Ativa a primeira instrução. */
	ativar_instrução(linha_atual);
}

/* Função que carrega o código-fonte para o REA */
function openFile(event) {
	/* Captura o arquivo lido pelo evento */
	var file = event.target.files[0];

	/* Cria uma instancia de FileReader 
	   Um objeto que é capaz de ler arquivos */
	var reader = new FileReader();

	/* Reseta o código */
	g_codigo.reset(file.name);

	/* Função que faz a leitura do arquivo.
	   Ela inicia quando o elemento lido foi carregado completamente */
	reader.onload = function () {
		/* Pega o output da leitura e divide em uma lista com as linhas */
		var linhas = (reader.result).split('\n');

		/*Para cada uma das linhas */
		linhas.forEach(linha => {
			g_codigo.instruções.push(new Instrução(linha));

			//Achando a função main
			if(linha.search(/int\s+main\s*\(.*\)\s*{?/) != -1){
				linha_atual = g_codigo.instruções.length - 1;
			}
		});

		set_codigo();

		console.log("instrução main: " + g_codigo.instruções[linha_atual].texto);
	};

	/* Chama a função que lê o arquivo 
	   Ela está sendo chamada para ler Texto */
	reader.readAsText(file);
};

/* TODO: Criar a função que salva os valores recebidos*/
function saveTable(){
	var table = loadTableData();
	console.log(table);
}

/* Arrumar a treta */

/* TODO: Otimizar a função deixando-a genérica e legivel*/
/* Função que transforma os dados da tabela em JSON */
function loadTableData() {
	/* JSON da tabela */
	var tableJSON = [[]];

	/* Lista das possiveis colunas da tabela*/
	var cols = [];

	/* Cabeçalho da tabela */
	var tableHeader = document.getElementsByClassName("MemHeader")[0];
	/* Para cada coluna do cabeçalho, pegue todos os filhos e adicione a coluna correspondente*/
	for(let i = 0; i < tableHeader.children.length; i++){
		cols[i] = document.getElementsByClassName("MCol"+(i+1));
	}

	/* Para cada linha da tabela crie um array no JSON */
	for(let i = 1; i < cols[0].length; i++){
		var empty = 0;	/* Variavel que vê colunas vazias*/
		var values = [];/* Variavel que captura os valores*/
		/* Para cada uma das colunas, capture o respectivo valor e adicione a values */
		for(let j = 0; j < cols.length; j++){
			if(j == 0){ /* Endereço é valor direto no html*/
				values[j] = cols[j][i].innerHTML;
			}else{ /* Outras colunas possuem um filho input */
				values[j] = cols[j][i].children[0].value;
				/* contando colunas vazias */
				empty += values[j] == 0 ? 1: 0; 
			}
		}

		/* Guarda o index de referencia do atributo JSON */
		var index = values[0]; //Endereço
		
		/* Se houver determinada quantidade de colunas vazias, não insere no JSON 
			É cols.length-1, pois Endereço nunca é vazio*/
		if(empty >= (cols.length-1))continue;

		/* Cria a linha do JSON com o nome da variável */
		tableJSON[index] = {};
		/* Adiciona todos os outros valores a linha */
		for(let j = 0; j < cols.length; j++){
			var attrName = cols[j][0].innerHTML;
			tableJSON[index][attrName] = values[j];
		}
	}
	
	/* Retorna o JSON com todas as informações */
	return tableJSON;
}

function avançar(){
	desativar_instrução(linha_atual);
	linha_atual++;
	//instrução_atual++;
	ativar_instrução(linha_atual);
}

function voltar(){
	desativar_instrução(linha_atual);
	linha_atual--;
	//instrução_atual--;
	ativar_instrução(linha_atual);
}

function ativar_instrução(linha){
	console.log("Ativando a linha " + linha);
	var instrução = document.getElementById("linha_" + linha);
	instrução.className += " Ativo";

	var número = document.getElementById("numero_" + linha);
	número.className += " Ativo";
}

function desativar_instrução(linha){
	console.log("Desativando a linha " + linha);
	var instrução = document.getElementById("linha_" + linha);
	instrução.className = instrução.className.replace(/\s?Ativo\s?/, "");

	var número = document.getElementById("numero_" + linha);
	número.className = número.className.replace(/\s?Ativo\s?/, "");
}

function listarArquivos(event) {
	document.getElementById("ListaDeExercicios").innerHTML = "";
	var arquivos = document.getElementById("CarregarArquivos").files;
	for(var i = 0; i < arquivos.length; i++){
		if(arquivos[i].name.endsWith(".c")){
			var novaLinha = document.createElement("tr");
			var nome = document.createElement("td");
			nome.innerHTML = arquivos[i].name;
			var dificuldade = document.createElement("td");
			dificuldade.innerHTML ="<span class='glyphicon glyphicon-star'></span>";
			for(var k = 0, j = Math.random()*10 % 4; k < j; k++){
				dificuldade.innerHTML += "<span class='glyphicon glyphicon-star'></span>";
			}
			novaLinha.appendChild(nome);
			novaLinha.appendChild(dificuldade);
			document.getElementById("ListaDeExercicios").appendChild(novaLinha);
		}
	}
}