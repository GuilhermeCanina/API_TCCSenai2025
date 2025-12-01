import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analisarRedacao = async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({ error: "Campo 'texto' é obrigatório." });
    }

    const model = genAI.getGenerativeModel({ model: "gemma-3n-e2b-it" });

const prompt = `
Você é um corretor oficial do ENEM. 
Avalie a redação abaixo e dê notas de 0 a 200 para cada uma das 5 competências do ENEM, **somente em múltiplos de 40** (0, 40, 80, 120, 160, 200):

1. Domínio da escrita formal da Língua Portuguesa.
2. Compreensão do tema e não fuga do assunto.
3. Capacidade de argumentação e uso de repertório sociocultural.
4. Coesão e coerência na organização do texto.
5. Proposta de intervenção clara, detalhada e viável.

Calcule a soma final (0 a 1000) com base nesses múltiplos.
No fim, some todas as competências para obter a nota final (0-1000) (Corretamente)
Responda SOMENTE em JSON válido, no formato:

{
  "competencia1": 0-200,
  "competencia2": 0-200,
  "competencia3": 0-200,
  "competencia4": 0-200,
  "competencia5": 0-200,
  "notaFinal": 0-1000,
  "comentarios": "feedback explicativo para o aluno"
}

Redação do aluno:
${texto}
`;


    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let avaliacao;

    if (jsonMatch) {
      try {
        avaliacao = JSON.parse(jsonMatch[0]);
      } catch (err) {
        avaliacao = { raw: responseText, error: "Falha ao converter para JSON" };
      }
    } else {
      avaliacao = { raw: responseText, error: "Nenhum JSON detectado" };
    }

    res.json(avaliacao);
  } catch (error) {
    console.error("Erro na correção da redação:", error);
    res.status(500).json({ error: "Erro ao corrigir redação" });
  }
};
