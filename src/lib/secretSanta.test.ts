import { afterEach, describe, expect, it, vi } from "vitest";
import { drawSecretSanta } from "./secretSanta";

const makeMembers = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `user-${i}` }));

function assertValidDraw(members: { id: string }[], pairs: { giver: { id: string }; receiver: { id: string } }[]) {
  const ids = members.map((m) => m.id).sort();

  // todos os membros aparecem exatamente uma vez como quem dá...
  expect(pairs.map((p) => p.giver.id).sort()).toEqual(ids);
  // ...e exatamente uma vez como quem recebe
  expect(pairs.map((p) => p.receiver.id).sort()).toEqual(ids);
  // ninguém tira a si mesmo
  for (const p of pairs) expect(p.receiver.id).not.toBe(p.giver.id);
}

describe("drawSecretSanta", () => {
  describe("propriedades do sorteio (para vários tamanhos de grupo)", () => {
    for (const n of [2, 3, 4, 5, 8, 10, 25, 50]) {
      it(`${n} participantes: cada um dá e recebe exatamente uma vez, sem auto-sorteio`, () => {
        // repete várias vezes porque o embaralhamento é aleatório
        for (let attempt = 0; attempt < 50; attempt++) {
          const members = makeMembers(n);
          assertValidDraw(members, drawSecretSanta(members));
        }
      });

      it(`${n} participantes: forma um único ciclo (ninguém fica preso em um subgrupo fechado)`, () => {
        for (let attempt = 0; attempt < 50; attempt++) {
          const members = makeMembers(n);
          const pairs = drawSecretSanta(members);
          const receiverOf = new Map(pairs.map((p) => [p.giver.id, p.receiver.id]));

          // seguindo quem-dá -> quem-recebe a partir de um membro, devemos
          // passar por todos antes de voltar ao início
          let current = members[0].id;
          const visited = new Set<string>();
          do {
            visited.add(current);
            current = receiverOf.get(current)!;
          } while (current !== members[0].id);

          expect(visited.size).toBe(n);
        }
      });
    }
  });

  it("não repete o mesmo presenteado para quem já foi sorteado (nenhum par duplicado)", () => {
    const members = makeMembers(12);
    for (let attempt = 0; attempt < 50; attempt++) {
      const pairs = drawSecretSanta(members);
      const keys = pairs.map((p) => `${p.giver.id}->${p.receiver.id}`);
      expect(new Set(keys).size).toBe(members.length);
    }
  });

  it("preserva os objetos originais de cada participante", () => {
    const members = [
      { id: "a", nome: "Caio" },
      { id: "b", nome: "Bel" },
      { id: "c", nome: "Ana" },
    ];
    const pairs = drawSecretSanta(members);
    for (const p of pairs) {
      expect(members).toContain(p.giver);
      expect(members).toContain(p.receiver);
    }
    const names = pairs.map((p) => p.giver.nome).sort();
    expect(names).toEqual(["Ana", "Bel", "Caio"]);
  });

  it("um único participante só pode tirar a si mesmo (caso degenerado documentado)", () => {
    const members = makeMembers(1);
    const pairs = drawSecretSanta(members);
    expect(pairs).toHaveLength(1);
    expect(pairs[0].giver.id).toBe(members[0].id);
    expect(pairs[0].receiver.id).toBe(members[0].id);
  });

  it("lança erro quando não há participantes", () => {
    expect(() => drawSecretSanta([])).toThrow("Nenhum participante.");
  });

  it("lança erro quando há ids duplicados", () => {
    expect(() => drawSecretSanta([{ id: "a" }, { id: "b" }, { id: "a" }])).toThrow("Participantes duplicados.");
  });

  it("não altera o array de entrada", () => {
    const members = makeMembers(6);
    const snapshot = members.map((m) => m.id);
    drawSecretSanta(members);
    expect(members.map((m) => m.id)).toEqual(snapshot);
  });

  describe("aleatoriedade", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("com 3 participantes, cada possível destinatário aparece em torno de 50% das vezes", () => {
      // com 3 pessoas há exatamente 2 ciclos válidos; A dá para B ou para C
      const members = makeMembers(3);
      const DRAWS = 2000;
      let aToB = 0;
      for (let i = 0; i < DRAWS; i++) {
        const pairs = drawSecretSanta(members);
        if (pairs.find((p) => p.giver.id === "user-0")!.receiver.id === "user-1") aToB++;
      }
      const ratio = aToB / DRAWS;
      expect(ratio).toBeGreaterThan(0.4);
      expect(ratio).toBeLessThan(0.6);
    });

    it("funciona com uma fonte de aleatoriedade determinística (embaralhamento não quebra as regras)", () => {
      vi.spyOn(crypto, "getRandomValues").mockImplementation(((arr: Uint32Array) => {
        arr.fill(0);
        return arr;
      }) as typeof crypto.getRandomValues);

      const members = makeMembers(7);
      assertValidDraw(members, drawSecretSanta(members));
    });
  });
});
