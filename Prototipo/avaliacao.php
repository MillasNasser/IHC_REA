<html>

<head>
	<meta charset="UTF8">
	<title>Visualizador de Ponteiros</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<!-- Pretty Print -->
	<link rel="stylesheet" href="frameworks/prettify/prettify.css">
	<script src="frameworks/prettify/prettify.js"></script>

	<script src="scripts/prototipo.js"></script>

	<script src="frameworks/bootstrap-4.0.0/js/bootstrap.min.js"></script>
	<link rel="stylesheet" href="frameworks/bootstrap-4.0.0/css/bootstrap.min.css">
	 

	<link rel="stylesheet" type="text/css" href="frameworks/gliphycons/bootstrap.css">
	<link rel="stylesheet" href="css/style.css" type="text/css">
</head>

<body onload="Start()">
	<nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
		<ul class="navbar-nav">
			<li class="nav-item">
				<a class="nav-link" href="index.php">
					<span class="glyphicon glyphicon-home"></span>
				</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="NovoExercicio.html">Registrar exercício</a>
			</li>
		</ul>
	</nav>

	<div class="container-fluid">
		<div class="btn-group">
			<button class="btn btn-info btn-sm" disabled onclick="voltar()">
				<span class="glyphicon glyphicon-chevron-left"> Voltar</span>
			</button>
			<button class="btn btn-info btn-sm" onclick="avançar();">
				<span class="glyphicon glyphicon-chevron-right"> Próximo</span>
			</button>
		</div>
		<div class="btn-group">
			<button class="btn btn-danger btn-sm" onclick="restartTable();">
				<span class="glyphicon glyphicon-repeat"> Resetar Exercício</span>
			</button>
		</div>
	</div><br/>

	<?php
		$exercicio = NULL;
		if(!empty($_POST)){
			$arquivo = "./exercicios/".$_POST['arquivo'];

			$executavel = substr( $arquivo,0 , strpos($arquivo,".c"));
			system("gcc -g ".$arquivo." -o ".$executavel);
			$sistema = popen("python2 parser.py ".$executavel,"r");
			$exercicio = fopen($arquivo,'r');
			$JSON = stream_get_contents($sistema);
			
			echo
			"<script>
				entradaRequisitos = JSON.parse('".str_replace("'","\'",$JSON)."');
			</script>";
		}else{
			echo "Não carregou o post";
		}
	?>

	<div class="container-fluid row">
		<div class="col-sm-6 d-inline-flex">
			<div id="LineNumbers" class="Numbers Dark-Base"></div>
			<div id="Code" class="Code w-100">
				<?php
					if($exercicio != NULL){
						/*echo 
						'<script>
							document.getElementById("Code").innerHTML = "";
						</script>';*/
						$i = 0;
						for($i = 1; !feof($exercicio); $i++){
							
							if(fscanf($exercicio,"%[^\n]\n",$leitura)==0){
								$leitura = '';
							}
							
							$instrucao = " ".str_replace('<', '&lt;', $leitura);
							$instrucao = str_replace("\\n", "\\\\n", $instrucao);
							$instrucao = str_replace('"', '\\"', $instrucao);
							//echo $instrucao;
							echo 
							'<script>
								var pre = document.createElement("pre");
								pre.className = "prettyprint prettyprinted";
								pre.id = "linha_" + '.$i.';
						
								pre.innerHTML = PR.prettyPrintOne("'.$instrucao.'", "C", true);
								document.getElementById("Code").appendChild(pre);
								
							</script>';
						}
						$i--;
						echo 
						'<script>
							genLinesNum('.$i.');
						</script>';
					}
				?>
			</div>
		</div>

		<table class="table table-striped col-sm-6">
			<thead>
				<tr class="MemHeader">
					<th class="table-dark MCol1">Endereço</th>
					<th class="MCol2">Nome da Variavel</th>
					<th class="MCol3">Valor</th>
					<th class="MCol4">Valor Desreferênciado</th>
				</tr>
			</thead>
			<tbody id="MemTabl">
			</tbody>
		</table>
	</div>
	<br/>
	<br/>
</body>

</html>
