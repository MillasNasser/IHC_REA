# -*- coding: utf-8 -*-

import os
import sys
import subprocess
import re
import json

def main():
	executavel = sys.argv[1]

	requisitos = []
	frames = []
	instrucoes = ['main']

	saida = subprocess.check_output(["./parser", executavel])

	re_frame = r"(?P<var>^[a-zA-z_]+ = .+?\n)+"
	results = re.finditer(re_frame, saida, re.DOTALL | re.MULTILINE)
	for match in results:
		frames.append(match.group(0).split('\n')[:-1])

	re_frame = r"\d+\t.*"
	results = re.finditer(re_frame, saida)
	for match in results:
		#instrucoes.append(match.group(0).split('\t')[0])
		instrucoes.append(match.group(0))
	
	for i in range(1, len(frames)):
		for j in range(len(frames[i])):
			if(frames[i][j] != frames[i - 1][j]):
				#requisitos.append({""})
				var, valor = frames[i][j].split(' = ')
				if 'char' in instrucoes[i]:
					valor = valor.split(' ')[1]
				requisitos.append({"Nome da Variavel": var, "Valor": valor, "linha": instrucoes[i].split('\t')[0]})
	
	sys.stdout.write(json.dumps(requisitos))
	sys.stdout.flush()

if __name__ == "__main__":
	main()
