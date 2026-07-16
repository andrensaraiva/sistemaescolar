import { IaRecusada, QUEM_PODE, type AiProvider, type PedidoIa, type RespostaIa } from './tipos';
import { provedorGemini } from './gemini';

/** Trocar de provedor é trocar esta linha. BLUEPRINT §4.7. */
const provedor: AiProvider = provedorGemini;

/**
 * O gateway. UM ponto server-side por onde toda IA passa — não existe segundo
 * caminho até o modelo, e é isso que torna as leis verificáveis num code review:
 * quem quiser burlar precisa criar outro gateway, e isso aparece.
 *
 * O que ele garante (CLAUDE.md §2.10 e §2.11):
 *   - a chave nunca vai ao cliente ($lib/server + $env/dynamic/private);
 *   - a IA nunca fala com o aluno — ver QUEM_PODE em ./tipos;
 *   - nunca fecha nota sozinha e nunca julga fraude: isso não é checado aqui,
 *     é consequência de não existir uso de IA que escreva nota ou veredito.
 *     O gateway devolve TEXTO. Quem grava nota é a tela onde você confirma.
 */
export async function pedirIa(pedido: PedidoIa): Promise<RespostaIa> {
	const permitidos = QUEM_PODE[pedido.uso];

	if (!permitidos) {
		throw new IaRecusada(`Uso de IA desconhecido: "${pedido.uso}".`);
	}

	if (!pedido.papel) {
		throw new IaRecusada('Chamada de IA sem papel identificado. Não existe IA anônima aqui.');
	}

	if (!permitidos.includes(pedido.papel)) {
		throw new IaRecusada(
			`O papel "${pedido.papel}" não pode pedir "${pedido.uso}". ` +
				`Toda saída de IA passa por um adulto antes de chegar a um menor de idade.`
		);
	}

	return provedor.gerar(pedido);
}
