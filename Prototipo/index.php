<html>

<head>
    <meta charset="UTF8">
    <title>Visualizador de Ponteiros</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
    
	<script src="frameworks/bootstrap-4.0.0/js/bootstrap.min.js"></script>
	<link rel="stylesheet" href="frameworks/bootstrap-4.0.0/css/bootstrap.min.css">
    
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
                                            <span class="glyphicon glyphicon-home"></span> Home
                                        </a>
                                    </li>

                                    
                                    <li class="nav-item">
                                        <a class="nav-link text-center" href="NovoExercicio.html">
                                            <span class="glyphicon glyphicon-floppy-save"></span>Criar exercício
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </aside>
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
                        <input type="hidden" name="arquivo" value="" id="NomeArquivo"/>
                    </form>
                </main>
            </div>
        </div>

    <!-- <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link active" href="index.php">
                    <span class="glyphicon glyphicon-home"></span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="NovoExercicio.html">Registrar exercício</a>
            </li>
        </ul>
    </nav> -->

    <!-- Tabela dos links -->

</body>

</html>