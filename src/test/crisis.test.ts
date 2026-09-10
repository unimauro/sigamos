import { describe, it, expect } from "vitest";
import { isCrisis } from "@/lib/support-chat";

describe("isCrisis — detección multilingüe", () => {
  it("detecta señales críticas en los 8 idiomas", () => {
    const positives = [
      "a veces quiero morir",           // es
      "I want to kill myself",          // en
      "je veux mourir ce soir",         // fr
      "死にたい気持ちが強い",              // ja
      "요즘 너무 죽고 싶어요",             // ko
      "я не хочу жить больше",           // ru
      "我不想活了",                       // zh
      "noriu mirti",                    // lt
      "es broma pero quiero matarme",   // minimización no baja el nivel
      "kms",                            // jerga
    ];
    for (const p of positives) {
      expect(isCrisis(p), `debería detectar: ${p}`).toBe(true);
    }
  });

  it("no marca conversación normal", () => {
    const negatives = [
      "hola, ¿cómo estás?",
      "tengo un examen mañana y estoy nervioso",
      "me siento un poco triste hoy",
      "how do I find a helpline",
    ];
    for (const n of negatives) {
      expect(isCrisis(n), `no debería marcar: ${n}`).toBe(false);
    }
  });
});
