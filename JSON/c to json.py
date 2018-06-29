# -*- coding: utf-8 -*-

import sys

class Instrucao:
	class Nomes:
		string = "texto"
		requisitos = "requisitos"
	
	#Faz um parse na linha.
	#to-do: criar uma classe static Requisitos pra cuidar desse parse.
	@staticmethod
	def get_requisitos(linha, indent_level):
		return ""

	@staticmethod
	def to_json(linha, indent_level = 2, indent_size = 4):
		#Removendo um possível '\n' ao final da linha.
		if(linha[-1] == '\n'):
			linha = linha[:-1]
		
		#Json não aceita tabs master race, então é preciso converter tabs pra espaços
		linha = linha.replace("\t", " " * indent_size)

		#Escapando as aspas duplas
		linha = linha.replace('"', r'\"')
		
		string = "\t" * indent_level + "{\n"
		
		indent_level += 1
		
		string += "\t" * indent_level + '"' + Instrucao.Nomes.string + '": '
		string += '"' + linha + '",\n'
		
		string += "\t" * indent_level + '"' + Instrucao.Nomes.requisitos + '": [\n'
		string += Instrucao.get_requisitos(linha, indent_level + 1)
		string += "\t" * indent_level + "]\n"
		
		indent_level -= 1

		string += "\t" * indent_level + "}"

		return string

def main(argv):
	entrada = argv[1] if(len(argv) > 1) else "exemplo.c"
	saida = argv[2] if(len(argv) > 2) else "exemplo.restricoes.json"
	with open(entrada) as fc:
		with open(saida, "w") as fj:
			instrucoes = '{\n\t"instruções": [\n'
			for linha in fc.readlines():
				instrucoes += Instrucao.to_json(linha) + ",\n"
			
			#removendo a vírgula da última instrução
			instrucoes = instrucoes[:-2] + "\n\t]\n}"

			fj.write(instrucoes)

if __name__ == "__main__":
	main(sys.argv)
