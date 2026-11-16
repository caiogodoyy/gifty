import { PageBack } from "@/components/PageBack";

const WHY = [
  ["Fim dos presentes repetidos", "Todo mundo do grupo vê o que a pessoa deseja e reserva o item — ninguém compra a mesma coisa."],
  ["A surpresa continua", "Quem recebe nunca vê o que foi reservado. Só os outros membros sabem."],
  ["Presente certeiro", "Foto, link da loja e tamanhos de roupa e calçado ficam à mão na hora de comprar."],
  ["Gratuito e sem complicação", "Sem anúncios e sem loja embutida: só a lista e o grupo."],
];

const STEPS = [
  ["1. Monte sua lista", "Em Minha Lista, toque em “+ Desejo” e informe nome, foto (URL da imagem ou upload), descrição e link da loja."],
  ["2. Informe seus tamanhos", "Em Perfil › Minhas Medidas & Tamanhos, preencha blusa, calça e calçado."],
  ["3. Crie ou entre em um grupo", "Em Grupos, toque em “+ Novo grupo” para criar e compartilhar o código de convite (ex.: SILVA-1234), ou use um código recebido para entrar. Você pode participar de até 3 grupos."],
  ["4. Veja a lista dos outros", "Toque em um membro do grupo para ver as medidas e os desejos dele."],
  ["5. Reserve em segredo", "Toque em “Reservar” no item que vai comprar. Os outros membros veem que está reservado; o dono do desejo não."],
  ["6. Amigo secreto (opcional)", "O criador do grupo pode sortear o amigo secreto. Cada pessoa vê apenas quem tirou."],
];

const FAQ = [
  ["O dono da lista vê o que eu reservei?", "Não. Em Minha Lista as reservas nunca aparecem para você."],
  ["Posso cancelar uma reserva?", "Sim, quem reservou pode cancelar. O criador do grupo também pode."],
  ["Esqueci minha senha.", "Na tela de login, use “Esqueci a senha” para receber um link de redefinição por e-mail."],
  ["Minha lista aparece em todos os grupos?", "Sim, a lista é sua e fica visível nos grupos dos quais você participa."],
];

function Cards({ rows }: { rows: string[][] }) {
  return (
    <ul className="space-y-2">
      {rows.map(([t, d]) => (
        <li key={t} className="card !p-3">
          <p className="font-bold">{t}</p>
          <p className="text-sm text-ink-soft">{d}</p>
        </li>
      ))}
    </ul>
  );
}

export default function HelpPage() {
  return (
    <>
      <PageBack href="/profile" label="Perfil" />
      <h1 className="page-title">Ajuda & Suporte</h1>

      <section className="card space-y-2">
        <h2 className="text-lg font-bold">O que é o Gifty?</h2>
        <p className="text-sm text-ink-soft">
          Um app de listas de presentes para família e amigos, com reserva secreta e amigo secreto. Cada um cria sua
          lista de desejos e o grupo escolhe o que dar — sem repetir e sem estragar a surpresa.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Por que usar?</h2>
        <Cards rows={WHY} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Como usar</h2>
        <Cards rows={STEPS} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Perguntas frequentes</h2>
        <div className="space-y-2">
          {FAQ.map(([q, a]) => (
            <details key={q} className="card !p-3">
              <summary className="cursor-pointer font-medium">{q}</summary>
              <p className="mt-2 text-sm text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
