function Start(qntLines, qntAddress) {
	genLinesNum(qntLines);
	genAddressNum(qntAddress);
}

/* Função que gera as linhas laterais do código */
function genLinesNum(qnt) {
	/* Pega a referência do output e reseta seu valor */
	document.getElementById("LineNumbers").innerHTML = "";
	for (let i = 0; i < qnt; i++) {
		/* Para cada index é criado um div, seu valor é o index */
		var linha = document.createElement("div");
		linha.innerHTML = i;

		/* Insere a nova div como filho do output */
		document.getElementById("LineNumbers").appendChild(linha);
	}
}

/* Função que gera a tabela de endereços */
function genAddressNum(qnt) {
	for (let i = 0; i < qnt; i++) {
		/* Cria um numero hexadecimal e o formata para 4 digitos 
			A contagen é feita de 4 em 4*/
		var hexNum = (i * 4).toString(16).toUpperCase();
		var formatHex = ("0000" + hexNum).slice(-4);

		/* Calcula qual é a quantidade de colunas na tabela */
		var qntCol = document.getElementsByClassName("MemHeader")[0].children.length;

		/* Cria uma div pai que receberá as colunas */
		var parent = document.createElement("div");
		parent.className = "MemBody";

		/* Primeira coluna, endereços gerados */
		var div = document.createElement("div");
		div.className = "MCol1 Dark-Base";
		div.innerHTML = "0x" + formatHex;
		/* Adiciona ao pai */
		parent.appendChild(div);

		/* Cria a segunda coluna até a quantidade de colunas 
			Todas elas possui um filho input*/
		for(let i = 2; i <= qntCol; i++){
			/* Cria a coluna */
			var div = document.createElement("div");
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

/* Função que carrega o código-fonte para o REA */
function openFile(event) {
	/* Captura o elemento lido pelo input */
	var input = event.target;

	/* Cria a referência do output para o codigo lido */
	var Code = document.getElementById("Code");
	/* Reseta seu valor */
	Code.innerHTML = "";

	/* Cria uma instancia de FileReader 
		Um objeto que é capaz de ler arquivos*/
	var reader = new FileReader();

	/* Função que faz a leitura do arquivo 
		Ela inicia quando o elemento lido foi carregado completamente*/
	reader.onload = function () {
		/* Pega o output da leitura e divide em uma lista com as linhas */
		var linhas = (reader.result).split('\n');

		/*Para cada uma das linhas */
		linhas.forEach(element => {
			/* Cria uma tag que exibe o texto como foi escrito 
				A tag é chamada de pre*/
			var pre = document.createElement("pre");
			pre.className = "prettyprint prettyprinted";

			/* Chama o formatador de código para a linha atual 
				A linguagem utilizada para formatar é C
				Para \n e <, são substituidos por símbolos mais convenientes*/
			pre.innerHTML = PR.prettyPrintOne(" "+element.replace("<","&lt;").replace("\n","\0") ,"C",true);

			/* Adiciona a linha ao output */
			Code.appendChild(pre);
		});

		/* Gera as linhas laterais de acordo o numero de linhas do arquivo */
		genLinesNum(linhas.length);
	};

	/* Chama a função que lê o arquivo 
		Ela está sendo chamada para ler Texto*/
	reader.readAsText(input.files[0]);
};