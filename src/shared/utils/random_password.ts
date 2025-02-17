// export func randomPassword(): string {

export function randomPassword(): string {
  const tamanhoMinimo = 12;
  const tamanhoMaximo = 16;

  const caracteresEspeciais = '!@#$%&*';
  const letrasMinusculas = 'abcdefghijklmnopqrstuvwxyz';
  const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numeros = '0123456789';

  const todosCaracteres =
    caracteresEspeciais + letrasMinusculas + letrasMaiusculas + numeros;

  const tamanhoSenha =
    Math.floor(Math.random() * (tamanhoMaximo - tamanhoMinimo + 1)) +
    tamanhoMinimo;

  let senha = '';

  for (let i = 0; i < tamanhoSenha; i++) {
    const indiceAleatorio = Math.floor(Math.random() * todosCaracteres.length);
    senha += todosCaracteres.charAt(indiceAleatorio);
  }

  return senha;
}
