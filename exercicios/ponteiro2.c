void muda(int *b) {
	int a = 3;
	*b = 2;
}

int main(){
	int a = 1;
	muda(&a);
	return a;
}