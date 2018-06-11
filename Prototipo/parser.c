#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

char *str_replace(const char *orig, const char *rep, const char *with){
	char *result; // the return string
    const char *ins;    // the next insert point
    char *tmp;    // varies
    int len_rep;  // length of rep (the string to remove)
    int len_with; // length of with (the string to replace rep with)
    int len_front; // distance between rep and end of last rep
    int count;    // number of replacements

    // sanity checks and initialization
    if (!orig && !rep)
        return NULL;
    len_rep = strlen(rep);
    if (len_rep == 0)
        return NULL; // empty rep causes infinite loop during count
    if (!with)
        with = "";
    len_with = strlen(with);

    // count the number of replacements needed
    ins = orig;
    for (count = 0; (tmp = strstr(ins, rep)) ; ++count) {
        ins = tmp + len_rep;
    }

    tmp = result = malloc(strlen(orig) + (len_with - len_rep) * count + 1);

    if (!result)
        return NULL;

    // first time through the loop, all the variable are set correctly
    // from here on,
    //    tmp points to the end of the result string
    //    ins points to the next occurrence of rep in orig
    //    orig points to the remainder of orig after "end of rep"
    while (count--) {
        ins = strstr(orig, rep);
        len_front = ins - orig;
        tmp = strncpy(tmp, orig, len_front) + len_front;
        tmp = strcpy(tmp, with) + len_with;
        orig += len_front + len_rep; // move to next "end of rep"
    }
    strcpy(tmp, orig);
    return result;
}

int main(int argc, char *argv[]){
	//Fazer uns error checkings.
	if(argc < 2){
		fprintf(stderr, "missing file.\n");
		return 1;
	}

	//Entrada.
	char *executavel = argv[1];

	//Possível saída.
	FILE *fout = stdout;
	if(argc > 2){
		fout = fopen(argv[2], "w");
	}


	char buff[2048] = {0};
	int pipe_pai[2];
	int pipe_filho[2];
	pid_t pid;

	if(pipe(pipe_pai) || pipe(pipe_filho)){
		perror("pipe");
		return 1;
	}
	
	pid = fork();
	if(pid == -1){
		perror("fork");
		return 1;
	}

	if(pid == 0){
		//Processo filho. Vai ser o gdb.
		//Escreve em pipe_pai[1] e lê em pipe_filho[0].

		//stdin -> pipe_filho[0]
		close(pipe_filho[1]);
		dup2(pipe_filho[0], 0);

		//stdout -> pipe_pai[1]
		close(pipe_pai[0]);
		dup2(pipe_pai[1], 1);

		FILE *err = fopen("/dev/null", "w");
		dup2(fileno(err), 2);

		if(execl("/usr/bin/gdb", "/usr/bin/gdb", "-silent", executavel, (char*) NULL) == -1){
			perror("exec gdb");
			return 1;
		}

	}else{
		//Processo pai. Vai enviar comandos pro gdb.
		//Escreve em pipe_filho[1] e lê em pipe_pai[0].

		close(pipe_filho[0]);
		close(pipe_pai[1]);

        int in = pipe_pai[0];
        int out = pipe_filho[1];

		char comando[128] = "b main\nr\n";

		write(out, comando, strlen(comando) + 1);
		/*sleep(1);
		read(in, buff, sizeof buff);
		printf("saida RUN: %s\n", buff);*/

		for(int i = 0; ; i++){
			strcpy(comando, "\ninfo args\ninfo locals\nn");
			write(out, comando, strlen(comando) + 1);
			//usleep(20000);
			usleep(500000);
			//sleep(1);
			memset(buff, 0, sizeof buff);
			read(in, buff, sizeof buff);
			//fprintf(fout, "NEXT %d:\ncomando: [%s]\n<%s>\n", i, comando, str_replace(buff, "(gdb) ", ""));
			if(strstr(buff, "terminated") != NULL || strstr(buff, "__libc_start_main") != NULL){
				break;
			}
			fprintf(fout, "%s\n============\n", str_replace(buff, "(gdb) ", ""));
			//getchar();
		}

		strcpy(comando, "\nq\ny\nq\n");
		write(out, comando, strlen(comando) + 1);
		/*sleep(1);
		read(in, buff, sizeof buff);
		printf("saida QUIT: %s\n", buff);*/

		//Espera o filho terminar.
		wait(NULL);
		exit(0);
	}
	return 0;
}
