# -*- coding: utf-8 -*-

import os
import sys
import subprocess
from time import sleep
import re
import json

re_identificador = r"[_a-zA-Z][_a-zA-Z0-9]*"
re_funcao = re_identificador + r"\s(?P<funcao>" + re_identificador + r")\(.*\);"
re_instrucao = r"\d+\t.*"
re_frame = r"(?P<var>^" + re_identificador + r" = .+?\n)+"

frames_pattern = re.compile(re_frame, re.DOTALL | re.MULTILINE)
instrucao_pattern = re.compile(re_instrucao)

i = 0
def pbuff(buff, sep = '=', l = 20):
	global i
	print l/2 * sep + " " + str(i) + " " + l/2 * sep + "\n" + buff + "\n" + sep * l
	i += 1

def nmain():
	#Entrada
	executavel = sys.argv[1]

	pipe_pai = os.pipe()
	pipe_filho = os.pipe()

	pid = os.fork()
	if(pid == -1):
		print "Erro no fork"
		exit(1)
	
	if(pid == 0):
		#Processo filho. Vai ser o gdb.
		#Escreve em pipe_pai[1] e lê em pipe_filho[0].

		#stdin -> pipe_filho[0]
		os.close(pipe_filho[1])
		os.dup2(pipe_filho[0], 0)

		#stdout -> pipe_pai[1]
		os.close(pipe_pai[0])
		os.dup2(pipe_pai[1], 1)

		err = open("/dev/null", "w")
		os.dup2(err.fileno(), 2)

		os.execl("/usr/bin/gdb", "/usr/bin/gdb", "-silent", executavel)
	else:
		#Processo pai. Vai enviar comandos pro gdb.
		#Escreve em pipe_filho[1] e lê em pipe_pai[0].

		os.close(pipe_filho[0])
		os.close(pipe_pai[1])

		pin = pipe_pai[0]
		pout = pipe_filho[1]

		def interage(comando, tempo_espera = 0.06, buffer_size = 2048):
			os.write(pout, comando + "\n")
			sleep(tempo_espera)
			if(buffer_size > 0):
				return os.read(pin, buffer_size)

		#Ignorando o lixo inicial.
		sleep(0.1)
		buff = os.read(pin, 2048)

		#Dados necessários
		funcoes = []
		frames = []
		instrucoes = ["main"]

		#Pegando os nomes das funções.
		buff = interage("info fun")

		results = re.finditer(re_funcao, buff)
		for match in results:
			funcao = match.group('funcao')
			funcoes.append(funcao)
			interage("b " + funcao, 0, 0)
		
		buff = interage("r", 0.5)
		results = instrucao_pattern.finditer(buff)
		for match in results:
			instrucoes.append(match.group(0))
		
		pbuff(buff)
		buff = interage("info args\ninfo locals").replace("(gdb) ", "").replace("No arguments.\n", "")
		
		while(not ("__libc_start_main" in buff or "SIGSEGV" in buff)):
			buff = interage("info args\ninfo locals").replace("(gdb) ", "").replace("No arguments.\n", "")
			pbuff(buff)
			buff = interage("n").replace("(gdb) ", "")
			pbuff(buff)

		buff = interage("q\n\y")

		print "=" * 20 + "\n" + buff + "\n" + "=" * 20

		os.wait()
		print funcoes
		exit(0)


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
	nmain()
