<html>

<head>
	<meta charset="utf-8">
	<title>Visualizador de Ponteiros</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="stylesheet" href="frameworks/bootstrap-4.0.0/css/bootstrap.min.css">

	<script src="frameworks/jquery/jquery-3.3.1.min.js"></script>
	<script src="frameworks/bootstrap-4.0.0/js/bootstrap.min.js"></script>

	
	<link rel="stylesheet" type="text/css" href="frameworks/gliphycons/bootstrap.css">
	<script src="scripts/prototipo.js"></script>
	<link rel="stylesheet" type="text/css" href="css/style.css">
</head>

<body>
	<!-- Header da página -->
	<div class="container-fluid">
		<div class="row h-100">
			<aside class="col-12 col-md-2 p-0 bg-dark">
				<nav class="navbar navbar-expand navbar-dark bg-dark flex-row">
					<div class="collapse navbar-collapse">
						<div class="flex-md-column flex-row navbar-nav w-100 justify-content-between">
							<ul class="list-unstyled components w-100">
								<li class="nav-item">
									<a class="nav-link text-center" href="index.php">
										<span class="glyphicon glyphicon-home"> </span> Home
									</a>
								</li>


								<li class="nav-item">
									<a class="nav-link text-center" href="NovoExercicio.html">
										<span class="glyphicon glyphicon-floppy-save"> </span> Criar exercício
									</a>
								</li>

								<li><hr/></li>

								<li>
									<button class="btn btn-info w-100" data-toggle="modal" data-target="#Tutorial">
										Tutorial
									</button>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</aside>

			<!-- Criação do modal do tutorial -->
			<div class="modal fade" id="Tutorial" tabindex="-1" role="dialog" aria-labelledby="tituloTutorial" aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="tituloTutorial"> Tutorial </h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							Alguma coisa no modal
						</div>
						<div class="modal-footer">
							<button class="btn btn-secondary" data-dismiss="modal" aria-label="Close">
								Close
							</button>
							<button class="btn btn-primary">Topper</button>
						</div>
					</div>
				</div>
			</div>
			<!-- Finalização do modal do tutorial -->
			
			<main class="row col-12 col-md-9 m-2" style="overflow: auto;">
				<form class="w-100" action="avaliacao.php" method="post" id="loadExercicios">
					<h1 class="display-4"> Carregar exercício </h1>
					<div class="container-fluid">
						<table class="table table-striped table-hover row-clickable">
							<thead>
								<tr>
									<th>Nome</th>
									<th>Dificuldade</th>
								</tr>
							</thead>
							<tbody id="ListaDeExercicios">
								<?php
									$exDir = scandir("./exercicios/");
									if($exDir == false){
										echo "Olha a mentira";
									}
									foreach($exDir as &$dir){
										if(substr($dir, -2) === ".c"){
											$estrelas = 1;
											echo "<tr>
													<td><a href='#' onclick='retornoClick(\"".$dir."\");'>".$dir."</a></td>
													<td>";
													for($i = 0 ; $i < $estrelas; $i++){
														echo "<span class='glyphicon glyphicon-star'></span>";
													}
											echo "</td></tr>";
										}
									}
								?>
							</tbody>
						</table>
					</div>
					<input type="hidden" name="arquivo" value="" id="NomeArquivo" />
				</form>
			</main>
		</div>
	</div>
</body>

</html>