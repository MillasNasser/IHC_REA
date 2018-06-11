<!DOCTYPE html>
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
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
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
    </nav>

    <!-- Tabela dos links -->
    <form action="avaliacao.php" method="post" id="loadExercicios">
        <div class="container">
            <table class="table table-striped table-hover row-clickable">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Dificuldade</th>
                    </tr>
                </thead>
                <tbody id="ListaDeExercicios">
                    <?php
                        $exDir = scandir("/mnt/981C548C1C546772/Dropbox/UFSJ/0_TP's/2018-1/IHC/REA/Prototipo/exercicios/");
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
</body>

</html>