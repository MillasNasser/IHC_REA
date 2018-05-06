//https://stackoverflow.com/a/6714233
String.prototype.replaceAll = function(str1, str2, ignore){
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

default_indent_size = 4;

class Instrucao{
	constructor(texto){
		//Removendo um possível '\n' ao final da linha.
		texto = texto.replace("\n", "");
		
		//Json não aceita tabs master race, então é preciso converter tabs pra espaços.
		texto = texto.replaceAll("\t", " ".repeat(default_indent_size));
		
		this.set_texto(texto);
		this.parse_requisitos(texto);
	}
	
	set_texto(texto){
		this.texto = texto;
	}
	
	parse_requisitos(texto){
		this.requisitos = [];
	}
}

class Codigo{
	constructor(nome){
		this.nome = nome;
		this.instruções = [];
	}
}

function ler_arquivo(event){
	var arquivo = event.target.files[0];
	var reader = new FileReader(arquivo.name);

	var codigo = new Codigo();

	reader.onload = function(){
		var linhas = reader.result.split("\n");

		linhas.forEach(linha => {
			codigo.instruções.push(new Instrucao(linha));
		});

		console.log("------------------------");
		console.log(JSON.stringify(codigo, null, 4));
	}

	reader.readAsText(arquivo);
}
