const fs = require("fs");
const path = require("path");

function carregarQuestoes() {
  const pasta = path.join(__dirname, "../dados/enem_questoes");
  let todas = [];

    fs.readdirSync(pasta).forEach((arquivo) => {
    if (arquivo.endsWith(".json")) {
      const conteudo = JSON.parse(
        fs.readFileSync(path.join(pasta, arquivo), "utf-8")
      );

      Object.keys(conteudo).forEach((ano) => {
        Object.keys(conteudo[ano]).forEach((materia) => {
          conteudo[ano][materia].forEach((questao) => {
            todas.push({ ...questao, ano, materia });
          });
        });
      });
    }
  });

  return todas;
}

const questoes = carregarQuestoes();

exports.getTodas = (req, res) => {
  res.json(questoes);
};

exports.getPorAno = (req, res) => {
  const { ano } = req.params;
  res.json(questoes.filter((q) => q.ano == ano));
};

exports.getPorMateria = (req, res) => {
  const { materia } = req.params;
  const filtradas = questoes.filter(
    (q) => q.materia.toLowerCase() === materia.toLowerCase()
  );

  res.json(filtradas);
};


exports.getPorAnoMateria = (req, res) => {
  const { ano, materia } = req.params;
  res.json(
    questoes.filter(
      (q) => q.ano == ano && q.materia.toLowerCase() === materia.toLowerCase()
    )
  );
};
