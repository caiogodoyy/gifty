/**
 * Sorteio de amigo secreto: embaralha os participantes (Fisher-Yates com
 * crypto.getRandomValues) e cada um presenteia o próximo do ciclo, o último
 * presenteia o primeiro. Isso garante por construção que:
 *  - todos presenteiam exatamente uma pessoa e são presenteados por exatamente uma;
 *  - ninguém tira a si mesmo (exceto se houver um único participante); nenhum nome falta ou se repete.
 */
export function drawSecretSanta<T extends { id: string }>(members: T[]): { giver: T; receiver: T }[] {
  if (members.length < 1) throw new Error("Nenhum participante.");
  if (new Set(members.map((m) => m.id)).size !== members.length) throw new Error("Participantes duplicados.");

  const order = [...members];
  for (let i = order.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    let j: number;
    do {
      crypto.getRandomValues(buf);
      j = buf[0] % (i + 1);
    } while (buf[0] >= 0x100000000 - (0x100000000 % (i + 1))); // sem viés de módulo
    [order[i], order[j]] = [order[j], order[i]];
  }
  const pairs = order.map((giver, i) => ({ giver, receiver: order[(i + 1) % order.length] }));

  // verificação final
  const givers = new Set(pairs.map((p) => p.giver.id));
  const receivers = new Set(pairs.map((p) => p.receiver.id));
  if (givers.size !== members.length || receivers.size !== members.length || (members.length > 1 && pairs.some((p) => p.giver.id === p.receiver.id)))
    throw new Error("Falha na verificação do sorteio.");
  return pairs;
}
