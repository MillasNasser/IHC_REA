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
	<div class="container-fluid">
		<div class="row h-100">
			<aside class="col-12 col-md-2 p-0 bg-dark">
				<nav class="navbar navbar-expand navbar-dark bg-dark flex-row">
					<div class="collapse navbar-collapse">
						<div class="flex-md-column flex-row navbar-nav w-100 justify-content-between">
							<ul class="list-unstyled components w-100">
								<li class="nav-item">
									<a class="nav-link text-center" href="index.php">
										<span class="glyphicon glyphicon-home"></span> Home
									</a>
								</li>
								
								<li class="nav-item">
									<a class="nav-link text-center" href="NovoExercicio.html">
										<span class="glyphicon glyphicon-floppy-save"></span>Criar exercício
									</a>
								</li>
								
								<li><hr/></li>
								
								<li>
									<button class="btn btn-info btn-sm w-100 m-1" disabled onclick="voltar()">
										<span class="glyphicon glyphicon-chevron-left pull-left"></span>Voltar
									</button>
								</li>
								<li>
									<button class="btn btn-info btn-sm w-100 m-1" onclick="avançar();">
										<span class="glyphicon glyphicon-chevron-right pull-left"></span>Verificar
									</button>
								</li>
								<li>
									<button class="btn btn-danger btn-sm w-100 m-1" onclick="restartTable();">
										<span class="glyphicon glyphicon-repeat"></span>Resetar
									</button>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</aside>
			<main class="row col-12 col-md-10" style="overflow: auto;">
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

				<div class="container m-0 ml-1 mt-1 p-0 col-12 col-xl-6">
					<div id="LineNumbers" class="Numbers Dark-Base col-1"></div>

					<div id="Code" class="Code col-11">
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

				<div class="col-12 m-0 ml-1 mt-1 p-0 col-xl-5">
					<table class="table table-striped"> 
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
			</main>
		</div>
	</div>

	
</body>

</html>
