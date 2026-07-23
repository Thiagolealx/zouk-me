import { useState, useEffect, useMemo } from "react";

const COLORS = {
  bg: "#1E1E25",
  surface: "#27272F",
  surfaceHover: "#31313B",
  border: "#3A3A46",
  gold: "#E8B84B",
  goldLight: "#F5D07A",
  goldDim: "#A07C28",
  text: "#F0EEE8",
  textMuted: "#9A9AAA",
  textDim: "#666677",
  green: "#4CAF82",
  red: "#E05C5C",
  blue: "#5B9CF6",
};

const PIX_KEY = "thiago.lealx@gmail.com";
const DEFAULT_MENSALIDADE = 85;

const TIPO_LABELS = {
  aluno: { label: "Aluno", color: COLORS.green, valor: 1 },
  meio: { label: "Meio Bolsista", color: COLORS.blue, valor: 0.5 },
  bolsista: { label: "Bolsista", color: COLORS.textMuted, valor: 0 },
};

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const NIVEIS_ZOUK = ["Zouk-0", "Zouk-1", "Zouk-2", "Zouk-3"];
const NIVEL_CORES = { "Zouk-0": "#A07850", "Zouk-1": "#4CAF82", "Zouk-2": "#E8B84B", "Zouk-3": "#5B9CF6" };
const NIVEL_EMOJI = { "Zouk-0": "🟤", "Zouk-1": "🟢", "Zouk-2": "🟡", "Zouk-3": "🔵" };
const NIVEL_NOMES = { "Zouk-0": "Fundamentações", "Zouk-1": "Nível 1", "Zouk-2": "Iniciados", "Zouk-3": "Intermediário" };

const PLANO_INICIAL = [
  // Zouk-0 — Fundamentações
  { id: "p0001", nivel: "Zouk-0", secao: "Fundamentos do Zouk", texto: "Base no Lugar" },
  { id: "p0002", nivel: "Zouk-0", secao: "Fundamentos do Zouk", texto: "Base Frente e Trás" },
  { id: "p0003", nivel: "Zouk-0", secao: "Fundamentos do Zouk", texto: "Base Corredor (líder e follow)" },
  { id: "p0004", nivel: "Zouk-0", secao: "Fundamentos do Zouk", texto: "Base Viradinha → conexão com Corredor" },
  { id: "p0005", nivel: "Zouk-0", secao: "Fundamentos do Zouk", texto: "Base Abertura" },
  { id: "p0006", nivel: "Zouk-0", secao: "Fundamentos do Zouk", texto: "Base Bônus" },
  { id: "p0007", nivel: "Zouk-0", secao: "Fundamentos do Zouk", texto: "Base Bônus esquerda" },
  { id: "p0008", nivel: "Zouk-0", secao: "Fundamentos do Zouk", texto: "Base Caminhada" },
  { id: "p0009", nivel: "Zouk-0", secao: "Fundamentos do Zouk", texto: "Base Rau" },
  { id: "p0010", nivel: "Zouk-0", secao: "Fundamentos do Zouk", texto: "Base S" },
  { id: "p0011", nivel: "Zouk-0", secao: "Fundamentos do Zouk", texto: "Base Soltinho" },
  { id: "p0012", nivel: "Zouk-0", secao: "Movements (Movimentos Essenciais)", texto: "Giro Simples" },
  { id: "p0013", nivel: "Zouk-0", secao: "Movements (Movimentos Essenciais)", texto: "Giro em L" },
  { id: "p0014", nivel: "Zouk-0", secao: "Movements (Movimentos Essenciais)", texto: "Giro Soltinho" },
  { id: "p0015", nivel: "Zouk-0", secao: "Movements (Movimentos Essenciais)", texto: "Giro em S" },
  { id: "p0016", nivel: "Zouk-0", secao: "Movements (Movimentos Essenciais)", texto: "Giro 90° / 180° / 270° (do ioiô)" },
  { id: "p0017", nivel: "Zouk-0", secao: "Variações das Bases", texto: "Bate quadril (viradinha)" },
  { id: "p0018", nivel: "Zouk-0", secao: "Variações das Bases", texto: "Ondinha pra trás (do ioiô)" },
  { id: "p0019", nivel: "Zouk-0", secao: "Variações das Bases", texto: "Rau (vai e volta)" },
  { id: "p0020", nivel: "Zouk-0", secao: "Variações das Bases", texto: "Rau (trava na cintura + volta líder)" },
  { id: "p0021", nivel: "Zouk-0", secao: "Variações das Bases", texto: "Frente-trás (passinho do Hugo)" },
  { id: "p0022", nivel: "Zouk-0", secao: "Estilizações / Brincadeiras Iniciais", texto: "Gostosinho" },
  { id: "p0023", nivel: "Zouk-0", secao: "Estilizações / Brincadeiras Iniciais", texto: "Variação do Bônus (mão trocada)" },
  { id: "p0024", nivel: "Zouk-0", secao: "Estilizações / Brincadeiras Iniciais", texto: "Variação do Ioiô" },
  { id: "p0025", nivel: "Zouk-0", secao: "Estilizações / Brincadeiras Iniciais", texto: "Abertura em X (Val & Vanessa)" },
  { id: "p0026", nivel: "Zouk-0", secao: "Estilizações / Brincadeiras Iniciais", texto: "Cambre" },
  { id: "p0027", nivel: "Zouk-0", secao: "Estilizações / Brincadeiras Iniciais", texto: "Introdução Lambada" },
  { id: "p0028", nivel: "Zouk-0", secao: "Estilizações / Brincadeiras Iniciais", texto: "Musicalidade I" },
  // Zouk-1 — Nível 1
  { id: "p0029", nivel: "Zouk-1", secao: "4 Fundamentos da Cabeça", texto: "Balão" },
  { id: "p0030", nivel: "Zouk-1", secao: "4 Fundamentos da Cabeça", texto: "Frango Assado" },
  { id: "p0031", nivel: "Zouk-1", secao: "4 Fundamentos da Cabeça", texto: "Cabeça Inclinada (giros)" },
  { id: "p0032", nivel: "Zouk-1", secao: "4 Fundamentos da Cabeça", texto: "Bate Cabelo" },
  { id: "p0033", nivel: "Zouk-1", secao: "Movimentos Principais", texto: "Viradinha 360º" },
  { id: "p0034", nivel: "Zouk-1", secao: "Movimentos Principais", texto: "Rau lateral (movimentação de Ryu)" },
  { id: "p0035", nivel: "Zouk-1", secao: "Movimentos Principais", texto: "Balão (parado, deslocamento, frente-trás, corredor, rau lateral)" },
  { id: "p0036", nivel: "Zouk-1", secao: "Movimentos Principais", texto: "Ioiô 360º" },
  { id: "p0037", nivel: "Zouk-1", secao: "Movimentos Principais", texto: "Boneca" },
  { id: "p0038", nivel: "Zouk-1", secao: "Movimentos Principais", texto: "Dadinho" },
  { id: "p0039", nivel: "Zouk-1", secao: "Variações e Combinações", texto: "Gostosinho (mão direita / esquerda)" },
  { id: "p0040", nivel: "Zouk-1", secao: "Variações e Combinações", texto: "Soltinho (caminhada — Amanda)" },
  { id: "p0041", nivel: "Zouk-1", secao: "Variações e Combinações", texto: "Bônus (caminhada, inclinado, espiral com cabeça, helicóptero)" },
  { id: "p0042", nivel: "Zouk-1", secao: "Variações e Combinações", texto: "Rau do Ioiô (vai e volta com cabeça — Dudu)" },
  { id: "p0043", nivel: "Zouk-1", secao: "Variações e Combinações", texto: "Ioiô com rau frente-trás" },
  { id: "p0044", nivel: "Zouk-1", secao: "Variações e Combinações", texto: "Ioiô com giro no eixo (Val & Vanessa Embraza)" },
  { id: "p0045", nivel: "Zouk-1", secao: "Frango Assado (variações)", texto: "No lugar (abençoando)" },
  { id: "p0046", nivel: "Zouk-1", secao: "Frango Assado (variações)", texto: "No lugar (manivela)" },
  { id: "p0047", nivel: "Zouk-1", secao: "Frango Assado (variações)", texto: "Variação do condutor" },
  { id: "p0048", nivel: "Zouk-1", secao: "Frango Assado (variações)", texto: "Avião da condutora (Nina & Matheus)" },
  { id: "p0049", nivel: "Zouk-1", secao: "Sequências", texto: "Val & Vanessa: balão + penteado + S + corredor + giro eixo + rau + meia boneca + saída balões + frango assado + cambre lateral" },
  { id: "p0050", nivel: "Zouk-1", secao: "Sequências", texto: "Zouk Sense (Renata Pessanha): viradinha + ioiô 360º + giro condutor + avião condutora" },
  { id: "p0051", nivel: "Zouk-1", secao: "Sequências", texto: "Dadinho & Imaculada Liberty: abertura L + corredor de costas + sequência planos" },
  { id: "p0052", nivel: "Zouk-1", secao: "Musicalidade", texto: "Musicalidade II" },
  // Zouk-2 — Iniciados
  { id: "p0053", nivel: "Zouk-2", secao: "Musicalidade", texto: "Musicalidade III (bom, tic tic)" },
  { id: "p0054", nivel: "Zouk-2", secao: "Musicalidade", texto: "Conjunto Drop (Linear, Eco, Explosivo) — 15x3" },
  { id: "p0055", nivel: "Zouk-2", secao: "Movimentos / Fundamentos Revisados", texto: "Giro no eixo" },
  { id: "p0056", nivel: "Zouk-2", secao: "Movimentos / Fundamentos Revisados", texto: "Giro contínuo" },
  { id: "p0057", nivel: "Zouk-2", secao: "Movimentos / Fundamentos Revisados", texto: "Giro duplo" },
  { id: "p0058", nivel: "Zouk-2", secao: "Movimentos / Fundamentos Revisados", texto: "Colgado" },
  { id: "p0059", nivel: "Zouk-2", secao: "Movimentos / Fundamentos Revisados", texto: "Torção" },
  { id: "p0060", nivel: "Zouk-2", secao: "Movimentos / Fundamentos Revisados", texto: "Toalha tradicional" },
  { id: "p0061", nivel: "Zouk-2", secao: "Movimentos / Fundamentos Revisados", texto: "Boneca com balão (xitão)" },
  { id: "p0062", nivel: "Zouk-2", secao: "Movimentos / Fundamentos Revisados", texto: "Boneca desprezada (+ variações: chão, normal, queda, mão, estrelinha)" },
  { id: "p0063", nivel: "Zouk-2", secao: "Movimentos / Fundamentos Revisados", texto: "Bônus direita" },
  { id: "p0064", nivel: "Zouk-2", secao: "Movimentos / Fundamentos Revisados", texto: "Caminhada com cabeça" },
  { id: "p0065", nivel: "Zouk-2", secao: "Variações", texto: "Gostosinho (mão esquerda + trava cintura + saída S)" },
  { id: "p0066", nivel: "Zouk-2", secao: "Variações", texto: "Rau/trava (troca de mãos, axila, aviãozinho)" },
  { id: "p0067", nivel: "Zouk-2", secao: "Variações", texto: "Chicote (2x, 3x, cima/baixo)" },
  { id: "p0068", nivel: "Zouk-2", secao: "Variações", texto: "Pião + variações" },
  { id: "p0069", nivel: "Zouk-2", secao: "Variações", texto: "Caminhada com chicote" },
  { id: "p0070", nivel: "Zouk-2", secao: "Variações", texto: "Movimentação com condutor atrás da follow" },
  { id: "p0071", nivel: "Zouk-2", secao: "Sequências e Aulas Especiais", texto: "Rafael & Isa (Rio)" },
  { id: "p0072", nivel: "Zouk-2", secao: "Sequências e Aulas Especiais", texto: "Dan (Giro giratório + twittado, frango assado + balão)" },
  { id: "p0073", nivel: "Zouk-2", secao: "Sequências e Aulas Especiais", texto: "Tracy & Cloves (travas + giro condutor)" },
  { id: "p0074", nivel: "Zouk-2", secao: "Sequências e Aulas Especiais", texto: "Zouk Sense Master Class 2022" },
  { id: "p0075", nivel: "Zouk-2", secao: "Sequências e Aulas Especiais", texto: "Aula da gente (Contra balanço I e II)" },
  { id: "p0076", nivel: "Zouk-2", secao: "Sequências e Aulas Especiais", texto: "Aula 17/07/24 (Corredor troca de mão lateral sem alterar frente/trás)" },
  { id: "p0077", nivel: "Zouk-2", secao: "Movimentos Extras", texto: "Sarada (+ variação)" },
  { id: "p0078", nivel: "Zouk-2", secao: "Movimentos Extras", texto: "Brincadeiras (cintura, chutes etc.)" },
  // Zouk-3 — Intermediário
  { id: "p0079", nivel: "Zouk-3", secao: "Musicalidade", texto: "Conjunto Drop (Linear, Eco, Explosivo) — 15x3" },
  { id: "p0080", nivel: "Zouk-3", secao: "Musicalidade", texto: "Estudo Musicalidade III" },
  { id: "p0081", nivel: "Zouk-3", secao: "Musicalidade", texto: "Drop II" },
  { id: "p0082", nivel: "Zouk-3", secao: "Revisões / Consolidação", texto: "Boneca desprezada (todas variações)" },
  { id: "p0083", nivel: "Zouk-3", secao: "Revisões / Consolidação", texto: "Boneca normal (balão simples, braço levantado)" },
  { id: "p0084", nivel: "Zouk-3", secao: "Revisões / Consolidação", texto: "Tornado" },
  { id: "p0085", nivel: "Zouk-3", secao: "Revisões / Consolidação", texto: "Toalha com mão esquerda" },
  { id: "p0086", nivel: "Zouk-3", secao: "Revisões / Consolidação", texto: "Toalha invertida (vinda do bônus/xitão)" },
  { id: "p0087", nivel: "Zouk-3", secao: "Revisões / Consolidação", texto: "Giro duplo (com variações e aplicação)" },
  { id: "p0088", nivel: "Zouk-3", secao: "Movimentos com Cabeça", texto: "Variações de cabeça (espiral, inclinado, helicóptero, ondulações)" },
  { id: "p0089", nivel: "Zouk-3", secao: "Movimentos com Cabeça", texto: "Trabalho de cabeça integrado ao giro duplo" },
  { id: "p0090", nivel: "Zouk-3", secao: "Novas Movimentações", texto: "Xitão" },
  { id: "p0091", nivel: "Zouk-3", secao: "Novas Movimentações", texto: "Sequência Ellisson (música Tropical)" },
  { id: "p0092", nivel: "Zouk-3", secao: "Novas Movimentações", texto: "Balão com estrelinhas (final boneca desprezada)" },
  { id: "p0093", nivel: "Zouk-3", secao: "Novas Movimentações", texto: "Balão abraçado → frango assado (trava cintura)" },
  { id: "p0094", nivel: "Zouk-3", secao: "Novas Movimentações", texto: "Ioiô com trava axila → aviãozinho → travas e cambres" },
  { id: "p0095", nivel: "Zouk-3", secao: "Novas Movimentações", texto: "Travas frente-trás (swig) com trava cintura" },
  { id: "p0096", nivel: "Zouk-3", secao: "Novas Movimentações", texto: "Clover no CG Zouk" },
  { id: "p0097", nivel: "Zouk-3", secao: "Novas Movimentações", texto: "Ioiô fechado, entrando na cabeça com trava → helicóptero em linha" },
  { id: "p0098", nivel: "Zouk-3", secao: "Novas Movimentações", texto: "Bônus com trava no final entrando helicóptero em linha (lento)" },
  { id: "p0099", nivel: "Zouk-3", secao: "Sequências e Aulas Especiais", texto: "Ale & Vic: ioiô fechado, pegando na mão, giros no balão e frango assado, finalizando no chicote" },
  { id: "p0100", nivel: "Zouk-3", secao: "Sequências e Aulas Especiais", texto: "Movimentação de Xitão: bonecas com balão e frango assado, finalizando num chicote" },
  { id: "p0101", nivel: "Zouk-3", secao: "Sequências e Aulas Especiais", texto: "Movimentação de Nayara: gostosinho com mão, giro no eixo, trabalhando movimentação de cabeça através do tronco" },
  { id: "p0102", nivel: "Zouk-3", secao: "Variações Estilizadas", texto: "Gostosinho por cima + giro no balão → cambre" },
  { id: "p0103", nivel: "Zouk-3", secao: "Variações Estilizadas", texto: "Boneca desprezada (passando por baixo, giro com mão na cabeça, final cambre)" },
  { id: "p0104", nivel: "Zouk-3", secao: "J&J — Estruturas", texto: "Estruturas básicas" },
  { id: "p0105", nivel: "Zouk-3", secao: "J&J — Estruturas", texto: "Finalizar em cada tempo" },
  { id: "p0106", nivel: "Zouk-3", secao: "J&J — Estruturas", texto: "Preencher as bases com pisadas: Frente e trás" },
  { id: "p0107", nivel: "Zouk-3", secao: "J&J — Estruturas", texto: "Preencher as bases com pisadas: Elástico" },
  { id: "p0108", nivel: "Zouk-3", secao: "J&J — Estruturas", texto: "Base do bônus" },
  { id: "p0109", nivel: "Zouk-3", secao: "J&J — Estruturas", texto: "Pisadas do bônus e ioiô" },
  { id: "p0110", nivel: "Zouk-3", secao: "J&J — Estruturas", texto: "Caminhada no bom tic e tic" },
  { id: "p0111", nivel: "Zouk-3", secao: "J&J — Bônus", texto: "Bônus para a direita (2x)" },
  { id: "p0112", nivel: "Zouk-3", secao: "J&J — Bônus", texto: "Bônus para a esquerda" },
  { id: "p0113", nivel: "Zouk-3", secao: "J&J — Bônus", texto: "Giro simples" },
  { id: "p0114", nivel: "Zouk-3", secao: "J&J — Bônus", texto: "Giro duplo" },
  { id: "p0115", nivel: "Zouk-3", secao: "J&J — Bônus", texto: "Giro duplo no bônus" },
  { id: "p0116", nivel: "Zouk-3", secao: "J&J — Bônus", texto: "Giro duplo no soltinho (ambos)" },
  { id: "p0117", nivel: "Zouk-3", secao: "J&J — Bônus", texto: "Dentro para fora" },
  { id: "p0118", nivel: "Zouk-3", secao: "J&J — Bônus", texto: "Fora para dentro" },
  { id: "p0119", nivel: "Zouk-3", secao: "J&J — Bônus", texto: "Preparação da boneca" },
  { id: "p0120", nivel: "Zouk-3", secao: "J&J — Bônus", texto: "Preparação da movimentação de cabeça" },
  { id: "p0121", nivel: "Zouk-3", secao: "J&J — Bônus", texto: "Preparação do movimento com o corpo" },
  { id: "p0122", nivel: "Zouk-3", secao: "J&J — Técnicas", texto: "Fechar as pernas" },
  { id: "p0123", nivel: "Zouk-3", secao: "J&J — Técnicas", texto: "Gostosinho sem mão" },
  { id: "p0124", nivel: "Zouk-3", secao: "J&J — Musicalidade", texto: "Marcação de ritmo" },
  { id: "p0125", nivel: "Zouk-3", secao: "J&J — Musicalidade", texto: "Identificar o 1 e o 5 como sílabas tônicas da música" },
  { id: "p0126", nivel: "Zouk-3", secao: "J&J — Personagem", texto: "Trabalhar tipos de personagem no J&J" },
  { id: "p0127", nivel: "Zouk-3", secao: "J&J — Personagem", texto: "Encontrar o 1 e o 5 nas músicas" },
  { id: "p0128", nivel: "Zouk-3", secao: "J&J — Exercícios", texto: "Dinâmica em dupla de costas marcando" },
  { id: "p0129", nivel: "Zouk-3", secao: "J&J — Exercícios", texto: "Contar sempre, mesmo quando não tem batida — movimentações sempre em: 1, 3, 5, 7" },
  { id: "p0130", nivel: "Zouk-3", secao: "J&J — Conteúdo", texto: "Contra criativo: substituir o contra da base por um elemento criativo, mantendo a estrutura da base" },
  { id: "p0131", nivel: "Zouk-3", secao: "J&J — Conteúdo", texto: "Finalizações em pausa: utilizar o próximo contra como espaço de criatividade antes de recuperar a marcação" },
  { id: "p0132", nivel: "Zouk-3", secao: "J&J — Conteúdo", texto: "Aceleração para marcação musical: antecipar elementos específicos da música para encaixar a movimentação" },
  { id: "p0133", nivel: "Zouk-3", secao: "J&J — Conteúdo", texto: "Interromper movimentos: aprender a finalizar musicalmente em qualquer ponto do movimento utilizando pausas" },
];

function getValor(aluno) {
  const base = aluno.mensalidade ?? DEFAULT_MENSALIDADE;
  const bruto = base * TIPO_LABELS[aluno.tipo].valor;
  const desconto = aluno.tipo !== "bolsista" ? (aluno.desconto ?? 0) : 0;
  return Math.max(0, bruto - desconto);
}

function getAulasPorMes(tipo, ano, mes, aulaDupla) {
  // Conta quantas quintas-feiras existem no mês (dia de aula)
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const primeiroDia = new Date(ano, mes, 1).getDay(); // 0=Dom, 4=Qui...
  const offset = (4 - primeiroDia + 7) % 7; // dias até a 1ª quinta
  const primeiraQuinta = offset + 1;
  const totalQuintas = Math.floor((diasNoMes - primeiraQuinta) / 7) + 1;
  const aulasBase = totalQuintas >= 5 ? 5 : 4;
  return tipo === "bolsista" && aulaDupla ? aulasBase * 2 : aulasBase;
}

function loadData() {
  try {
    const raw = localStorage.getItem("zoukme_v1");
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        frequencia: {},
        ...parsed,
        planoAula: parsed.planoAula || { itens: PLANO_INICIAL, marcados: {} },
      };
    }
  } catch {}
  return { alunos: [], pagamentos: {}, frequencia: {}, planoAula: { itens: PLANO_INICIAL, marcados: {} } };
}

function saveData(data) {
  localStorage.setItem("zoukme_v1", JSON.stringify(data));
}

function getMesKey(ano, mes) {
  return `${ano}-${String(mes + 1).padStart(2, "0")}`;
}

export default function App() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState("mensal");
  const [modalOpen, setModalOpen] = useState(false);
  const [editAluno, setEditAluno] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [busca, setBusca] = useState("");
  const [buscaFoco, setBuscaFoco] = useState(false);
  const [planoModalOpen, setPlanoModalOpen] = useState(false);
  const [editPlanoItem, setEditPlanoItem] = useState(null);
  const [planoSubTab, setPlanoSubTab] = useState("geral");

  const now = new Date();
  const [mesSel, setMesSel] = useState(now.getMonth());
  const [anoSel, setAnoSel] = useState(now.getFullYear());
  const [nivelIdx, setNivelIdx] = useState(0);
  const [freqMesSel, setFreqMesSel] = useState(now.getMonth());
  const [freqAnoSel, setFreqAnoSel] = useState(now.getFullYear());
  const [freqNivelSel, setFreqNivelSel] = useState("todos");

  useEffect(() => { saveData(data); }, [data]);

  const mesKey = getMesKey(anoSel, mesSel);
  const pagMes = data.pagamentos[mesKey] || {};

  const alunosMes = useMemo(() => {
    return data.alunos
      .filter(a => a.ativo !== false)
      .map(a => ({
        ...a,
        valor: getValor(a),
        pago: pagMes[a.id] === true,
      }));
  }, [data.alunos, pagMes]);

  const totalEsperado = alunosMes.reduce((s, a) => s + a.valor, 0);
  const totalPago = alunosMes.filter(a => a.pago).reduce((s, a) => s + a.valor, 0);
  const totalPendente = totalEsperado - totalPago;
  const metade = totalEsperado / 2;
  const progresso = totalEsperado > 0 ? (totalPago / totalEsperado) * 100 : 0;

  function togglePago(id) {
    const novo = { ...pagMes, [id]: !pagMes[id] };
    setData(d => ({ ...d, pagamentos: { ...d.pagamentos, [mesKey]: novo } }));
  }

  function togglePresenca(alunoId, aulaIdx, freqKey) {
    setData(d => {
      const freqMes = d.frequencia[freqKey] || {};
      const presencas = freqMes[alunoId] ? [...freqMes[alunoId]] : [];
      const atual = presencas[aulaIdx];
      // Ciclo: vazio → ✓ presente → ✕ faltou → vazio
      if (atual === true) {
        presencas[aulaIdx] = "falta";
      } else if (atual === "falta") {
        presencas[aulaIdx] = undefined;
      } else {
        presencas[aulaIdx] = true;
      }
      return {
        ...d,
        frequencia: {
          ...d.frequencia,
          [freqKey]: { ...freqMes, [alunoId]: presencas },
        },
      };
    });
  }

  function salvarAluno(aluno) {
    if (aluno.id) {
      setData(d => ({ ...d, alunos: d.alunos.map(a => a.id === aluno.id ? aluno : a) }));
    } else {
      const novo = { ...aluno, id: Date.now().toString() };
      setData(d => ({ ...d, alunos: [...d.alunos, novo] }));
    }
    setModalOpen(false);
    setEditAluno(null);
  }

  function deletarAluno(id) {
    setData(d => ({ ...d, alunos: d.alunos.filter(a => a.id !== id) }));
    setConfirmDelete(null);
  }

  function toggleMarcado(id) {
    setData(d => ({
      ...d,
      planoAula: {
        ...d.planoAula,
        marcados: { ...d.planoAula.marcados, [id]: !d.planoAula.marcados[id] },
      },
    }));
  }

  function salvarPlanoItem(form) {
    if (form.id) {
      setData(d => ({
        ...d,
        planoAula: {
          ...d.planoAula,
          itens: d.planoAula.itens.map(i => i.id === form.id ? { ...i, ...form } : i),
        },
      }));
    } else {
      const novo = { ...form, id: "p" + Date.now() };
      setData(d => ({
        ...d,
        planoAula: {
          ...d.planoAula,
          itens: [...d.planoAula.itens, novo],
        },
      }));
    }
    setPlanoModalOpen(false);
    setEditPlanoItem(null);
  }

  function deletarPlanoItem(id) {
    setData(d => {
      const { [id]: _, ...restoMarcados } = d.planoAula.marcados;
      return {
        ...d,
        planoAula: {
          itens: d.planoAula.itens.filter(i => i.id !== id),
          marcados: restoMarcados,
        },
      };
    });
  }

  function toggleAtivo(id) {
    setData(d => ({
      ...d,
      alunos: d.alunos.map(a => a.id === id ? { ...a, ativo: a.ativo === false ? true : false } : a),
    }));
  }

  function exportarBackup() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const hoje = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `zouk-me-backup-${hoje}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importarBackup(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed.alunos || !Array.isArray(parsed.alunos)) {
          alert("Arquivo inválido: estrutura de dados não reconhecida.");
          return;
        }
        const confirmar = window.confirm(
          `Importar backup com ${parsed.alunos.length} aluno(s)? Isso vai SUBSTITUIR os dados atuais.`
        );
        if (confirmar) {
          setData({
            alunos: parsed.alunos,
            pagamentos: parsed.pagamentos || {},
            frequencia: parsed.frequencia || {},
            planoAula: parsed.planoAula || { itens: PLANO_INICIAL, marcados: {} },
          });
        }
      } catch {
        alert("Erro ao ler o arquivo. Verifique se é um backup válido do Zouk - me.");
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  }

  function whatsappLink(aluno) {
    const val = getValor(aluno);
    if (!aluno.whatsapp || val === 0) return null;
    const num = aluno.whatsapp.replace(/\D/g, "");
    const msg = encodeURIComponent(
      `Olá ${aluno.nome}! 👋\n\nSua mensalidade do *Zouk - me* referente a *${MESES[mesSel]}/${anoSel}* é de *R$ ${val.toFixed(2).replace(".", ",")}*.\n\n💸 Pix: ${PIX_KEY}\n\nQualquer dúvida, é só chamar! 🎶`
    );
    return `https://wa.me/55${num}?text=${msg}`;
  }

  function gerarResumoWhatsApp() {
    const pagos = alunosMes.filter(a => a.pago && a.valor > 0);
    const pendentes = alunosMes.filter(a => !a.pago && a.valor > 0);
    const gratuitos = alunosMes.filter(a => a.valor === 0);

    let msg = `📊 *Resumo ${MESES[mesSel]}/${anoSel}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━\n\n`;

    if (pagos.length > 0) {
      msg += `✅ *Pagaram (${pagos.length}):*\n`;
      pagos.forEach(a => { msg += `  • ${a.nome} — R$ ${a.valor.toFixed(2).replace(".", ",")}\n`; });
      msg += "\n";
    }

    if (pendentes.length > 0) {
      msg += `⏳ *Pendentes (${pendentes.length}):*\n`;
      pendentes.forEach(a => { msg += `  • ${a.nome} — R$ ${a.valor.toFixed(2).replace(".", ",")}\n`; });
      msg += "\n";
    }

    if (gratuitos.length > 0) {
      msg += `🎓 *Gratuitos (${gratuitos.length}):*\n`;
      gratuitos.forEach(a => { msg += `  • ${a.nome}\n`; });
      msg += "\n";
    }

    msg += `━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💰 *Financeiro:*\n`;
    msg += `  Total esperado: R$ ${totalEsperado.toFixed(2).replace(".", ",")}\n`;
    msg += `  Arrecadado: R$ ${totalPago.toFixed(2).replace(".", ",")}\n`;
    msg += `  Pendente: R$ ${totalPendente.toFixed(2).replace(".", ",")}\n\n`;
    msg += `✂️ *Divisão:*\n`;
    msg += `  Sua parte: R$ ${metade.toFixed(2).replace(".", ",")}\n`;
    msg += `  Sócio: R$ ${metade.toFixed(2).replace(".", ",")}`;

    const link = `https://wa.me/5583998699329?text=${encodeURIComponent(msg)}`;
    window.open(link, "_blank");
  }

  function gerarResumoFrequencia() {
    const freqKey = getMesKey(freqAnoSel, freqMesSel);
    const freqMes = data.frequencia[freqKey] || {};
    const ativos = data.alunos.filter(a => a.ativo !== false).sort((a, b) => a.nome.localeCompare(b.nome));

    let msg = `📋 *Relatório de Frequência*\n`;
    msg += `*${MESES[freqMesSel]}/${freqAnoSel}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━\n\n`;

    ativos.forEach(aluno => {
      const totalAulas = getAulasPorMes(aluno.tipo, freqAnoSel, freqMesSel, aluno.aulaDupla);
      const presencas = freqMes[aluno.id] || [];
      const qtdPresente = presencas.filter(v => v === true).length;
      const qtdFalta = presencas.filter(v => v === "falta").length;
      const pct = totalAulas > 0 ? Math.round((qtdPresente / totalAulas) * 100) : 0;
      const emoji = pct >= 75 ? "✅" : pct >= 50 ? "⚠️" : "❌";
      msg += `${emoji} *${aluno.nome}* — ${qtdPresente}/${totalAulas} (${pct}%)`;
      if (qtdFalta > 0) msg += ` · ${qtdFalta} falta${qtdFalta !== 1 ? "s" : ""}`;
      msg += `\n`;
    });

    const link = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(link, "_blank");
  }

  const alunosAtivos = data.alunos.filter(a => a.ativo !== false);
  const alunosInativos = data.alunos.filter(a => a.ativo === false);

  // Agrupar por nível (só ativos)
  const niveisList = [...new Set(alunosAtivos.map(a => a.nivel))].sort((a,b) => Number(a)-Number(b));

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Inter', 'Segoe UI', sans-serif", paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "20px 24px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: COLORS.gold }}>Zouk</span>
            <span style={{ fontSize: 22, fontWeight: 300, color: COLORS.textMuted }}>— me</span>
          </div>
          <p style={{ fontSize: 12, color: COLORS.textDim, margin: "0 0 16px", letterSpacing: 1, textTransform: "uppercase" }}>Controle de Mensalidades</p>
          <div style={{ display: "flex", gap: 0, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {[["mensal","Mensal"],["niveis","Níveis"],["frequencia","Frequência"],["plano","Plano"],["alunos","Alunos"],["inativos","Inativos"]].map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px 16px", fontSize: 13, fontWeight: 600,
                color: tab === t ? COLORS.gold : COLORS.textMuted,
                borderBottom: tab === t ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                transition: "all 0.15s",
                whiteSpace: "nowrap", flexShrink: 0,
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 0" }}>

        {/* TAB MENSAL */}
        {tab === "mensal" && (
          <div>
            {/* Seletor de mês */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <button onClick={() => {
                if (mesSel === 0) { setMesSel(11); setAnoSel(a => a-1); }
                else setMesSel(m => m-1);
              }} style={btnNav}>‹</button>
              <span style={{ fontSize: 18, fontWeight: 700, minWidth: 180, textAlign: "center" }}>
                {MESES[mesSel]} <span style={{ color: COLORS.textMuted, fontWeight: 400 }}>{anoSel}</span>
              </span>
              <button onClick={() => {
                if (mesSel === 11) { setMesSel(0); setAnoSel(a => a+1); }
                else setMesSel(m => m+1);
              }} style={btnNav}>›</button>
            </div>

            {/* Cards resumo */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
              <Card label="Total Esperado" value={`R$ ${totalEsperado.toFixed(2).replace(".",",")}`} color={COLORS.textMuted} />
              <Card label="Arrecadado" value={`R$ ${totalPago.toFixed(2).replace(".",",")}`} color={COLORS.green} />
              <Card label="Pendente" value={`R$ ${totalPendente.toFixed(2).replace(".",",")}`} color={totalPendente > 0 ? COLORS.red : COLORS.green} />
            </div>

            {/* Botão resumo WhatsApp */}
            <button
              onClick={gerarResumoWhatsApp}
              style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
                background: "#25D36622", color: "#25D366",
                border: "1px solid #25D36644", borderRadius: 10,
                padding: "10px 18px", fontSize: 13, fontWeight: 700,
                cursor: "pointer", width: "100%", justifyContent: "center",
              }}
            >
              📋 Gerar Resumo do Mês e Enviar no WhatsApp
            </button>
            {/* Barra de progresso */}
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12, color: COLORS.textMuted }}>
                <span style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Progresso do mês</span>
                <span style={{ color: COLORS.gold, fontWeight: 700 }}>{progresso.toFixed(0)}%</span>
              </div>
              <div style={{ height: 8, background: COLORS.border, borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 99,
                  width: `${progresso}%`,
                  background: `linear-gradient(90deg, ${COLORS.goldDim}, ${COLORS.gold})`,
                  transition: "width 0.6s ease",
                }} />
              </div>
              {/* Divisão com sócio */}
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Sua parte</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.gold }}>R$ {metade.toFixed(2).replace(".",",")}</div>
                </div>
                <div style={{ width: 1, background: COLORS.border }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Parte do sócio</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.gold }}>R$ {metade.toFixed(2).replace(".",",")}</div>
                </div>
              </div>
            </div>

            {/* Lista por nível */}
            {data.alunos.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.textDim }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🎶</div>
                <div style={{ fontSize: 14 }}>Nenhum aluno cadastrado ainda.</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Vá na aba Alunos para adicionar.</div>
              </div>
            ) : (
              niveisList.map(nivel => {
                const grupo = alunosMes.filter(a => a.nivel === nivel);
                // Pendentes primeiro, pagos no final
                const pendentes = grupo.filter(a => !a.pago);
                const pagos = grupo.filter(a => a.pago);

                function renderCard(aluno) {
                  const link = whatsappLink(aluno);
                  return (
                    <div key={aluno.id} style={{
                      background: COLORS.surface,
                      border: `1px solid ${aluno.pago ? COLORS.green + "33" : COLORS.border}`,
                      borderRadius: 10, padding: "12px 14px",
                      display: "flex", alignItems: "center", gap: 12,
                      transition: "all 0.25s",
                      opacity: aluno.pago ? 0.6 : 1,
                    }}>
                      {/* Checkbox */}
                      {aluno.valor > 0 && (
                        <button onClick={() => togglePago(aluno.id)} style={{
                          width: 22, height: 22, borderRadius: 6, border: `2px solid ${aluno.pago ? COLORS.green : COLORS.border}`,
                          background: aluno.pago ? COLORS.green : "transparent",
                          cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontSize: 13, fontWeight: 700, transition: "all 0.15s",
                        }}>
                          {aluno.pago ? "✓" : ""}
                        </button>
                      )}
                      {aluno.valor === 0 && (
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: COLORS.border, flexShrink: 0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color: COLORS.textDim }}>—</div>
                      )}
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          textDecoration: aluno.pago ? "line-through" : "none",
                          color: aluno.pago ? COLORS.textDim : COLORS.text,
                        }}>{aluno.nome}</div>
                        <div style={{ fontSize: 11, color: aluno.pago ? COLORS.textDim : TIPO_LABELS[aluno.tipo].color, marginTop: 1 }}>
                          {aluno.pago ? "Pago" : TIPO_LABELS[aluno.tipo].label}
                        </div>
                      </div>
                      {/* Valor */}
                      <div style={{ fontSize: 15, fontWeight: 700, color: aluno.valor > 0 ? (aluno.pago ? COLORS.green : COLORS.text) : COLORS.textDim, marginRight: 8 }}>
                        {aluno.valor > 0 ? `R$ ${aluno.valor.toFixed(2).replace(".",",")}` : "Gratuito"}
                      </div>
                      {/* WhatsApp — só para pendentes */}
                      {link && !aluno.pago && (
                        <a href={link} target="_blank" rel="noreferrer" style={{
                          background: "#25D36622", color: "#25D366", border: "1px solid #25D36644",
                          borderRadius: 7, padding: "5px 10px", fontSize: 12, fontWeight: 600,
                          textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
                        }}>
                          📲 Cobrar
                        </a>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={nivel} style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                      Nível {nivel}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {pendentes.map(renderCard)}
                      {pagos.length > 0 && pendentes.length > 0 && (
                        <div style={{
                          display: "flex", alignItems: "center", gap: 8, margin: "4px 0",
                        }}>
                          <div style={{ flex: 1, height: 1, background: COLORS.border }} />
                          <span style={{ fontSize: 10, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 0.8, flexShrink: 0 }}>
                            {pagos.length} pago{pagos.length !== 1 ? "s" : ""}
                          </span>
                          <div style={{ flex: 1, height: 1, background: COLORS.border }} />
                        </div>
                      )}
                      {pagos.map(renderCard)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB NÍVEIS */}
        {tab === "niveis" && (() => {
          const nivelIdxSafe = Math.min(nivelIdx, Math.max(0, niveisList.length - 1));
          const nivelAtual = niveisList[nivelIdxSafe];
          const alunosNivel = alunosAtivos.filter(a => a.nivel === nivelAtual);
          const qtdAluno = alunosNivel.filter(a => a.tipo === "aluno").length;
          const qtdMeio = alunosNivel.filter(a => a.tipo === "meio").length;
          const qtdBolsista = alunosNivel.filter(a => a.tipo === "bolsista").length;
          const totalNivel = alunosNivel.reduce((s, a) => s + getValor(a), 0);

          return (
            <div>
              {niveisList.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.textDim }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🎶</div>
                  <div style={{ fontSize: 14 }}>Nenhum aluno cadastrado ainda.</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Vá na aba Alunos para adicionar.</div>
                </div>
              ) : (
                <>
                  {/* Navegação de nível */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <button
                      onClick={() => setNivelIdx(i => Math.max(0, i - 1))}
                      disabled={nivelIdxSafe === 0}
                      style={{ ...btnNav, opacity: nivelIdxSafe === 0 ? 0.3 : 1 }}
                    >‹</button>
                    <span style={{ fontSize: 18, fontWeight: 700, minWidth: 180, textAlign: "center" }}>
                      Nível <span style={{ color: COLORS.gold }}>{nivelAtual}</span>
                      <span style={{ color: COLORS.textMuted, fontWeight: 400, fontSize: 13 }}> ({nivelIdxSafe + 1}/{niveisList.length})</span>
                    </span>
                    <button
                      onClick={() => setNivelIdx(i => Math.min(niveisList.length - 1, i + 1))}
                      disabled={nivelIdxSafe === niveisList.length - 1}
                      style={{ ...btnNav, opacity: nivelIdxSafe === niveisList.length - 1 ? 0.3 : 1 }}
                    >›</button>
                  </div>

                  {/* Cards resumo do nível */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 20 }}>
                    <Card label="Total no nível" value={`${alunosNivel.length} aluno${alunosNivel.length !== 1 ? "s" : ""}`} color={COLORS.text} />
                    <Card label="Receita nível" value={`R$ ${totalNivel.toFixed(2).replace(".",",")}`} color={COLORS.gold} />
                  </div>

                  {/* Breakdown por tipo */}
                  <div style={{
                    display: "flex", gap: 8, marginBottom: 20,
                    background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                    borderRadius: 10, padding: "12px 16px",
                  }}>
                    <div style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.green }}>{qtdAluno}</div>
                      <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>Aluno</div>
                    </div>
                    <div style={{ width: 1, background: COLORS.border }} />
                    <div style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.blue }}>{qtdMeio}</div>
                      <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>Meio Bolsista</div>
                    </div>
                    <div style={{ width: 1, background: COLORS.border }} />
                    <div style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.textMuted }}>{qtdBolsista}</div>
                      <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>Bolsista</div>
                    </div>
                  </div>

                  {/* Lista de alunos do nível */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {alunosNivel.map(aluno => (
                      <div key={aluno.id} style={{
                        background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                        borderRadius: 10, padding: "12px 16px",
                        display: "flex", alignItems: "center", gap: 12,
                      }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 8,
                          background: TIPO_LABELS[aluno.tipo].color + "22",
                          border: `1px solid ${TIPO_LABELS[aluno.tipo].color}44`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, fontWeight: 800, color: TIPO_LABELS[aluno.tipo].color, flexShrink: 0,
                        }}>
                          {aluno.nome.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{aluno.nome}</div>
                          <div style={{ fontSize: 11, color: TIPO_LABELS[aluno.tipo].color, marginTop: 1 }}>
                            {TIPO_LABELS[aluno.tipo].label}
                            {aluno.whatsapp ? ` · ${aluno.whatsapp}` : ""}
                          </div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: getValor(aluno) > 0 ? COLORS.text : COLORS.textDim, flexShrink: 0 }}>
                          {getValor(aluno) > 0 ? `R$ ${getValor(aluno).toFixed(2).replace(".",",")}` : "Gratuito"}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })()}

        {/* TAB FREQUÊNCIA */}
        {tab === "frequencia" && (() => {
          const freqKey = getMesKey(freqAnoSel, freqMesSel);
          const freqMes = data.frequencia[freqKey] || {};
          const niveisFreq = [...new Set(alunosAtivos.map(a => a.nivel))].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));

          const alunosFiltrados = [...alunosAtivos]
            .filter(a => freqNivelSel === "todos" || a.nivel === freqNivelSel)
            .sort((a, b) => a.nome.localeCompare(b.nome));

          const totalAulasMes = getAulasPorMes("aluno", freqAnoSel, freqMesSel);

          function renderAluno(aluno) {
            const totalAulas = getAulasPorMes(aluno.tipo, freqAnoSel, freqMesSel, aluno.aulaDupla);
            const presencas = freqMes[aluno.id] || [];
            const qtdPresente = presencas.filter(v => v === true).length;
            const qtdFalta = presencas.filter(v => v === "falta").length;
            const pct = totalAulas > 0 ? Math.round((qtdPresente / totalAulas) * 100) : 0;
            const corPct = pct >= 75 ? COLORS.green : pct >= 50 ? COLORS.gold : COLORS.red;

            return (
              <div key={aluno.id} style={{
                background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                borderRadius: 12, padding: "14px 16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: TIPO_LABELS[aluno.tipo].color + "22",
                    border: `1px solid ${TIPO_LABELS[aluno.tipo].color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, color: TIPO_LABELS[aluno.tipo].color, flexShrink: 0,
                  }}>
                    {aluno.nome.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{aluno.nome}</div>
                    <div style={{ fontSize: 11, color: TIPO_LABELS[aluno.tipo].color, marginTop: 1 }}>
                      {TIPO_LABELS[aluno.tipo].label}
                      {freqNivelSel === "todos" && <> · Nível {aluno.nivel}</>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: corPct }}>{pct}%</div>
                    <div style={{ fontSize: 10, color: COLORS.textDim }}>
                      {qtdPresente}/{totalAulas} presentes
                      {qtdFalta > 0 && <span style={{ color: COLORS.red }}> · {qtdFalta} falta{qtdFalta !== 1 ? "s" : ""}</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {Array.from({ length: totalAulas }).map((_, i) => {
                    const presente = presencas[i] === true;
                    const faltou = presencas[i] === "falta";
                    return (
                      <button
                        key={i}
                        onClick={() => togglePresenca(aluno.id, i, freqKey)}
                        title={presente ? "Clique para marcar como falta" : faltou ? "Clique para limpar" : "Clique para marcar presença"}
                        style={{
                          flex: 1, height: 38, borderRadius: 8, cursor: "pointer",
                          border: `2px solid ${presente ? COLORS.green : faltou ? COLORS.red : COLORS.border}`,
                          background: presente ? COLORS.green + "33" : faltou ? COLORS.red + "22" : "transparent",
                          color: presente ? COLORS.green : faltou ? COLORS.red : COLORS.textDim,
                          fontSize: 16, fontWeight: 700,
                          transition: "all 0.15s",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        {presente ? "✓" : faltou ? "✕" : <span style={{ fontSize: 11 }}>Aula {i + 1}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }

          return (
            <div>
              {/* Seletor de mês */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <button onClick={() => {
                  if (freqMesSel === 0) { setFreqMesSel(11); setFreqAnoSel(a => a - 1); }
                  else setFreqMesSel(m => m - 1);
                }} style={btnNav}>‹</button>
                <span style={{ fontSize: 18, fontWeight: 700, minWidth: 180, textAlign: "center" }}>
                  {MESES[freqMesSel]} <span style={{ color: COLORS.textMuted, fontWeight: 400 }}>{freqAnoSel}</span>
                </span>
                <button onClick={() => {
                  if (freqMesSel === 11) { setFreqMesSel(0); setFreqAnoSel(a => a + 1); }
                  else setFreqMesSel(m => m + 1);
                }} style={btnNav}>›</button>
              </div>

              {/* Badge de aulas no mês */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16,
                background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                borderRadius: 8, padding: "6px 12px", fontSize: 12, color: COLORS.textMuted,
              }}>
                <span style={{ color: COLORS.gold, fontWeight: 700 }}>{totalAulasMes} aulas</span>
                <span>neste mês</span>
                {totalAulasMes === 5 && (
                  <span style={{
                    background: COLORS.gold + "22", color: COLORS.gold,
                    border: `1px solid ${COLORS.gold}44`, borderRadius: 5,
                    padding: "1px 6px", fontSize: 10, fontWeight: 700,
                  }}>5ª semana</span>
                )}
              </div>

              {/* Botão relatório de frequência WhatsApp */}
              <button
                onClick={gerarResumoFrequencia}
                style={{
                  display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
                  background: "#25D36622", color: "#25D366",
                  border: "1px solid #25D36644", borderRadius: 10,
                  padding: "10px 18px", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", width: "100%", justifyContent: "center",
                }}
              >
                📋 Gerar Relatório de Frequência e Enviar no WhatsApp
              </button>

              {/* Sub-navegação por nível */}
              {niveisFreq.length > 0 && (
                <div style={{
                  display: "flex", gap: 0, overflowX: "auto", WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "none", msOverflowStyle: "none",
                  borderBottom: `1px solid ${COLORS.border}`, marginBottom: 20,
                  marginLeft: -24, marginRight: -24, paddingLeft: 24,
                }}>
                  <button onClick={() => setFreqNivelSel("todos")} style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: "8px 14px", fontSize: 12, fontWeight: 600,
                    color: freqNivelSel === "todos" ? COLORS.gold : COLORS.textMuted,
                    borderBottom: freqNivelSel === "todos" ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                    whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s",
                  }}>
                    Todos
                  </button>
                  {niveisFreq.map(nivel => {
                    const cor = NIVEL_CORES[`Zouk-${nivel}`] || COLORS.textMuted;
                    const emoji = NIVEL_EMOJI[`Zouk-${nivel}`] || "⚪";
                    const ativo = freqNivelSel === nivel;
                    const qtdNivel = alunosAtivos.filter(a => a.nivel === nivel);
                    const totalPresentes = qtdNivel.reduce((s, a) => {
                      const p = (freqMes[a.id] || []).filter(v => v === true).length;
                      return s + p;
                    }, 0);
                    const totalPossivel = qtdNivel.reduce((s, a) => s + getAulasPorMes(a.tipo, freqAnoSel, freqMesSel, a.aulaDupla), 0);
                    const pctNivel = totalPossivel > 0 ? Math.round((totalPresentes / totalPossivel) * 100) : 0;
                    return (
                      <button key={nivel} onClick={() => setFreqNivelSel(nivel)} style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: "8px 14px", fontSize: 12, fontWeight: 600,
                        color: ativo ? cor : COLORS.textMuted,
                        borderBottom: ativo ? `2px solid ${cor}` : "2px solid transparent",
                        whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s",
                      }}>
                        {emoji} N{nivel}
                        <span style={{ marginLeft: 4, fontSize: 10, color: ativo ? cor : COLORS.textDim }}>
                          {pctNivel}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {alunosFiltrados.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.textDim }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🎶</div>
                  <div style={{ fontSize: 14 }}>Nenhum aluno cadastrado ainda.</div>
                </div>
              ) : freqNivelSel === "todos" ? (
                // Visão "Todos": agrupado por nível
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {niveisFreq.map(nivel => {
                    const cor = NIVEL_CORES[`Zouk-${nivel}`] || COLORS.textMuted;
                    const emoji = NIVEL_EMOJI[`Zouk-${nivel}`] || "⚪";
                    const grupo = alunosFiltrados.filter(a => a.nivel === nivel);
                    if (grupo.length === 0) return null;
                    return (
                      <div key={nivel}>
                        <div style={{
                          display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
                          padding: "7px 12px",
                          background: COLORS.surface, border: `1px solid ${cor}33`,
                          borderRadius: 8, borderLeft: `3px solid ${cor}`,
                        }}>
                          <span>{emoji}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: cor }}>Nível {nivel}</span>
                          <span style={{ fontSize: 11, color: COLORS.textDim }}>— {grupo.length} aluno{grupo.length !== 1 ? "s" : ""}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {grupo.map(renderAluno)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Visão de nível específico
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {alunosFiltrados.map(renderAluno)}
                </div>
              )}
            </div>
          );
        })()}

        {/* TAB PLANO DE AULA */}
        {tab === "plano" && (() => {
          const plano = data.planoAula || { itens: PLANO_INICIAL, marcados: {} };
          const totalItens = plano.itens.length;
          const totalMarcados = plano.itens.filter(i => plano.marcados[i.id]).length;
          const progGeral = totalItens > 0 ? (totalMarcados / totalItens) * 100 : 0;

          // Níveis presentes nos itens, ordenados
          const niveisPresentes = [...new Set(plano.itens.map(i => i.nivel))].sort();

          // Garante que subTab seja válido
          const subTabAtual = planoSubTab;

          return (
            <div>
              {/* Sub-navegação por nível */}
              <div style={{
                display: "flex", gap: 0, overflowX: "auto", WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none", msOverflowStyle: "none",
                borderBottom: `1px solid ${COLORS.border}`, marginBottom: 20, marginLeft: -24, marginRight: -24, paddingLeft: 24,
              }}>
                {/* Aba Geral */}
                <button onClick={() => setPlanoSubTab("geral")} style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "8px 14px", fontSize: 12, fontWeight: 600,
                  color: subTabAtual === "geral" ? COLORS.gold : COLORS.textMuted,
                  borderBottom: subTabAtual === "geral" ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                  whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s",
                }}>
                  Geral
                </button>
                {/* Abas por nível */}
                {niveisPresentes.map(nivel => {
                  const itensN = plano.itens.filter(i => i.nivel === nivel);
                  const marcN = itensN.filter(i => plano.marcados[i.id]).length;
                  const cor = NIVEL_CORES[nivel] || COLORS.textMuted;
                  const emoji = NIVEL_EMOJI[nivel] || "⚪";
                  const ativo = subTabAtual === nivel;
                  return (
                    <button key={nivel} onClick={() => setPlanoSubTab(nivel)} style={{
                      background: "none", border: "none", cursor: "pointer",
                      padding: "8px 14px", fontSize: 12, fontWeight: 600,
                      color: ativo ? cor : COLORS.textMuted,
                      borderBottom: ativo ? `2px solid ${cor}` : "2px solid transparent",
                      whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s",
                    }}>
                      {emoji} {nivel}
                      <span style={{
                        marginLeft: 5, fontSize: 10, fontWeight: 700,
                        color: ativo ? cor : COLORS.textDim,
                      }}>
                        {marcN}/{itensN.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* ===== SUB-ABA GERAL (CRUD) ===== */}
              {subTabAtual === "geral" && (
                <div>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 13, color: COLORS.textMuted }}>
                      {totalMarcados} de {totalItens} conteúdos marcados
                    </div>
                    <button onClick={() => { setEditPlanoItem(null); setPlanoModalOpen(true); }} style={{
                      background: COLORS.gold, color: "#0D0D0F", border: "none", borderRadius: 8,
                      padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                    }}>
                      + Adicionar
                    </button>
                  </div>

                  {/* Barra de progresso geral */}
                  <div style={{
                    background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                    borderRadius: 10, padding: "12px 16px", marginBottom: 20,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12, color: COLORS.textMuted }}>
                      <span style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Progresso geral</span>
                      <span style={{ color: COLORS.gold, fontWeight: 700 }}>{progGeral.toFixed(0)}%</span>
                    </div>
                    <div style={{ height: 6, background: COLORS.border, borderRadius: 99, overflow: "hidden", marginBottom: 12 }}>
                      <div style={{
                        height: "100%", borderRadius: 99, width: `${progGeral}%`,
                        background: `linear-gradient(90deg, ${COLORS.goldDim}, ${COLORS.gold})`,
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                    {/* Mini progresso por nível */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {niveisPresentes.map(nivel => {
                        const itN = plano.itens.filter(i => i.nivel === nivel);
                        const mkN = itN.filter(i => plano.marcados[i.id]).length;
                        const pN = itN.length > 0 ? (mkN / itN.length) * 100 : 0;
                        const cor = NIVEL_CORES[nivel] || COLORS.textMuted;
                        return (
                          <button key={nivel} onClick={() => setPlanoSubTab(nivel)} style={{
                            flex: 1, minWidth: 80, background: COLORS.surfaceHover,
                            border: `1px solid ${cor}33`, borderRadius: 8, padding: "8px 10px",
                            cursor: "pointer", textAlign: "left",
                          }}>
                            <div style={{ fontSize: 10, color: cor, fontWeight: 700, marginBottom: 4 }}>
                              {NIVEL_EMOJI[nivel] || "⚪"} {nivel}
                            </div>
                            <div style={{ height: 4, background: COLORS.border, borderRadius: 99, overflow: "hidden", marginBottom: 3 }}>
                              <div style={{ height: "100%", borderRadius: 99, width: `${pN}%`, background: cor }} />
                            </div>
                            <div style={{ fontSize: 9, color: COLORS.textDim }}>{mkN}/{itN.length} · {pN.toFixed(0)}%</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lista completa com CRUD */}
                  {niveisPresentes.map(nivel => {
                    const itensNivel = plano.itens.filter(i => i.nivel === nivel);
                    const secoes = [...new Set(itensNivel.map(i => i.secao))];
                    const cor = NIVEL_CORES[nivel] || COLORS.textMuted;
                    return (
                      <div key={nivel} style={{ marginBottom: 24 }}>
                        <div style={{
                          display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
                          padding: "8px 12px",
                          background: COLORS.surface, border: `1px solid ${cor}33`,
                          borderRadius: 8, borderLeft: `3px solid ${cor}`,
                        }}>
                          <span>{NIVEL_EMOJI[nivel] || "⚪"}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: cor }}>{nivel}</span>
                          <span style={{ fontSize: 11, color: COLORS.textDim }}>— {NIVEL_NOMES[nivel] || ""}</span>
                        </div>
                        {secoes.map(secao => (
                          <div key={secao} style={{ marginBottom: 12, paddingLeft: 4 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>
                              {secao}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                              {itensNivel.filter(i => i.secao === secao).map(item => (
                                <div key={item.id} style={{
                                  display: "flex", alignItems: "center", gap: 9,
                                  background: COLORS.surface,
                                  border: `1px solid ${COLORS.border}`,
                                  borderRadius: 7, padding: "8px 10px",
                                }}>
                                  <div style={{ flex: 1, fontSize: 13, lineHeight: 1.4, color: COLORS.text }}>
                                    {item.texto}
                                  </div>
                                  <button onClick={() => { setEditPlanoItem(item); setPlanoModalOpen(true); }} style={btnIcon} title="Editar">✏️</button>
                                  <button onClick={() => deletarPlanoItem(item.id)} style={btnIcon} title="Remover">🗑️</button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}

                  {totalItens === 0 && (
                    <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.textDim }}>
                      <div style={{ fontSize: 36, marginBottom: 12 }}>🎶</div>
                      <div style={{ fontSize: 14 }}>Nenhum conteúdo no plano ainda.</div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>Clique em "+ Adicionar" para começar.</div>
                    </div>
                  )}
                </div>
              )}

              {/* ===== SUB-ABA DE NÍVEL (checkboxes) ===== */}
              {subTabAtual !== "geral" && niveisPresentes.includes(subTabAtual) && (() => {
                const nivel = subTabAtual;
                const cor = NIVEL_CORES[nivel] || COLORS.textMuted;
                const emoji = NIVEL_EMOJI[nivel] || "⚪";
                const itensNivel = plano.itens.filter(i => i.nivel === nivel);
                const marcadosNivel = itensNivel.filter(i => plano.marcados[i.id]).length;
                const pctNivel = itensNivel.length > 0 ? (marcadosNivel / itensNivel.length) * 100 : 0;
                const secoes = [...new Set(itensNivel.map(i => i.secao))];

                return (
                  <div>
                    {/* Cabeçalho do nível */}
                    <div style={{
                      background: COLORS.surface, border: `1px solid ${cor}33`,
                      borderRadius: 12, padding: "16px 18px", marginBottom: 20,
                      borderLeft: `4px solid ${cor}`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 22 }}>{emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 800, color: cor }}>{nivel}</div>
                          <div style={{ fontSize: 12, color: COLORS.textDim }}>{NIVEL_NOMES[nivel] || ""}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 22, fontWeight: 800, color: cor }}>{pctNivel.toFixed(0)}%</div>
                          <div style={{ fontSize: 11, color: COLORS.textDim }}>{marcadosNivel} de {itensNivel.length}</div>
                        </div>
                      </div>
                      <div style={{ height: 8, background: COLORS.border, borderRadius: 99, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 99, width: `${pctNivel}%`,
                          background: cor, transition: "width 0.5s ease",
                        }} />
                      </div>
                    </div>

                    {/* Seções com checkboxes */}
                    {secoes.map(secao => {
                      const itensSec = itensNivel.filter(i => i.secao === secao);
                      const marcSec = itensSec.filter(i => plano.marcados[i.id]).length;
                      return (
                        <div key={secao} style={{ marginBottom: 18 }}>
                          <div style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            marginBottom: 7,
                          }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 0.8 }}>
                              {secao}
                            </div>
                            <div style={{ fontSize: 10, color: cor, fontWeight: 600 }}>
                              {marcSec}/{itensSec.length}
                            </div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {itensSec.map(item => {
                              const marcado = plano.marcados[item.id] === true;
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => toggleMarcado(item.id)}
                                  style={{
                                    display: "flex", alignItems: "center", gap: 12,
                                    background: marcado ? cor + "11" : COLORS.surface,
                                    border: `1px solid ${marcado ? cor + "55" : COLORS.border}`,
                                    borderRadius: 9, padding: "10px 14px",
                                    cursor: "pointer", textAlign: "left", width: "100%",
                                    transition: "all 0.15s",
                                  }}
                                >
                                  <div style={{
                                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                    border: `2px solid ${marcado ? cor : COLORS.border}`,
                                    background: marcado ? cor : "transparent",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#fff", fontSize: 12, fontWeight: 800, transition: "all 0.15s",
                                  }}>
                                    {marcado ? "✓" : ""}
                                  </div>
                                  <div style={{
                                    flex: 1, fontSize: 13, lineHeight: 1.4, fontWeight: marcado ? 400 : 500,
                                    color: marcado ? COLORS.textDim : COLORS.text,
                                    textDecoration: marcado ? "line-through" : "none",
                                  }}>
                                    {item.texto}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          );
        })()}

        {/* TAB ALUNOS */}
        {tab === "alunos" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>{alunosAtivos.length} aluno(s) ativo(s)</div>
              <button onClick={() => { setEditAluno(null); setModalOpen(true); }} style={{
                background: COLORS.gold, color: "#0D0D0F", border: "none", borderRadius: 8,
                padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}>
                + Novo Aluno
              </button>
            </div>

            {/* Barra de busca com autocomplete */}
            <div style={{ position: "relative", marginBottom: 16 }}>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  fontSize: 14, color: COLORS.textDim, pointerEvents: "none",
                }}>🔍</span>
                <input
                  style={{ ...inp, paddingLeft: 36, marginBottom: 0 }}
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                  onFocus={() => setBuscaFoco(true)}
                  onBlur={() => setTimeout(() => setBuscaFoco(false), 150)}
                  placeholder="Buscar aluno por nome..."
                />
                {busca && (
                  <button onClick={() => setBusca("")} style={{
                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: COLORS.textDim, fontSize: 16,
                  }}>×</button>
                )}
              </div>
              {/* Dropdown autocomplete */}
              {buscaFoco && busca.length > 0 && (() => {
                const sugestoes = data.alunos.filter(a =>
                  a.nome.toLowerCase().includes(busca.toLowerCase())
                ).slice(0, 5);
                return sugestoes.length > 0 ? (
                  <div style={{
                    position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
                    background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                    borderRadius: 8, marginTop: 4, overflow: "hidden",
                    boxShadow: "0 8px 24px #00000066",
                  }}>
                    {sugestoes.map(a => (
                      <button key={a.id} onMouseDown={() => setBusca(a.nome)} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        width: "100%", background: "none", border: "none", cursor: "pointer",
                        padding: "10px 14px", textAlign: "left",
                        borderBottom: `1px solid ${COLORS.border}`,
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceHover}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        <div style={{
                          width: 28, height: 28, borderRadius: 6,
                          background: TIPO_LABELS[a.tipo].color + "22",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 800, color: TIPO_LABELS[a.tipo].color, flexShrink: 0,
                        }}>
                          {a.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>
                            {a.nome.split(new RegExp(`(${busca})`, "i")).map((part, i) =>
                              part.toLowerCase() === busca.toLowerCase()
                                ? <span key={i} style={{ color: COLORS.gold }}>{part}</span>
                                : part
                            )}
                          </div>
                          <div style={{ fontSize: 11, color: TIPO_LABELS[a.tipo].color }}>
                            {TIPO_LABELS[a.tipo].label} · Nível {a.nivel}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null;
              })()}
            </div>

            {/* Backup / Restaurar */}
            <div style={{
              display: "flex", gap: 8, marginBottom: 20, padding: "10px 14px",
              background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10,
              alignItems: "center", flexWrap: "wrap",
            }}>
              <span style={{ fontSize: 11, color: COLORS.textDim, marginRight: "auto" }}>
                💾 Backup dos dados (recomendado salvar de vez em quando)
              </span>
              <button onClick={exportarBackup} style={{ ...btnSec, padding: "6px 14px", fontSize: 12 }}>
                ⬇️ Exportar
              </button>
              <label style={{ ...btnSec, padding: "6px 14px", fontSize: 12, cursor: "pointer", margin: 0 }}>
                ⬆️ Importar
                <input type="file" accept=".json" onChange={importarBackup} style={{ display: "none" }} />
              </label>
            </div>

            {alunosAtivos.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.textDim }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>💃</div>
                <div style={{ fontSize: 14 }}>Nenhum aluno ativo. Adicione o primeiro!</div>
              </div>
            ) : (() => {
              const alunosFiltrados = busca.trim()
                ? alunosAtivos.filter(a => a.nome.toLowerCase().includes(busca.toLowerCase()))
                : alunosAtivos;
              return alunosFiltrados.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: COLORS.textDim }}>
                  <div style={{ fontSize: 14 }}>Nenhum aluno encontrado para "{busca}".</div>
                </div>
              ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {alunosFiltrados.map(aluno => (
                  <div key={aluno.id} style={{
                    background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                    borderRadius: 10, padding: "12px 16px",
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, background: COLORS.border,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 800, color: COLORS.gold, flexShrink: 0,
                    }}>
                      N{aluno.nivel}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{aluno.nome}</div>
                      <div style={{ fontSize: 11, color: TIPO_LABELS[aluno.tipo].color, marginTop: 1 }}>
                        {TIPO_LABELS[aluno.tipo].label} · {getValor(aluno) > 0 ? `R$ ${getValor(aluno).toFixed(2).replace(".",",")}` : "Gratuito"}
                        {aluno.tipo !== "bolsista" && (aluno.desconto ?? 0) > 0 && (
                          <span style={{ color: COLORS.green }}> (desc. R$ {Number(aluno.desconto).toFixed(2).replace(".",",")})</span>
                        )}
                        {aluno.whatsapp ? ` · ${aluno.whatsapp}` : ""}
                      </div>
                    </div>
                    <button onClick={() => { setEditAluno(aluno); setModalOpen(true); }} style={btnIcon} title="Editar">✏️</button>
                    <button onClick={() => setConfirmDelete(aluno)} style={btnIcon} title="Excluir">🗑️</button>
                  </div>
                ))}
              </div>
              );
            })()}
          </div>
        )}

        {/* TAB INATIVOS */}
        {tab === "inativos" && (
          <div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16 }}>
              {alunosInativos.length} aluno(s) inativo(s) — mensalidade congelada
            </div>
            {alunosInativos.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.textDim }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
                <div style={{ fontSize: 14 }}>Nenhum aluno inativo no momento.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {alunosInativos.map(aluno => (
                  <div key={aluno.id} style={{
                    background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                    borderRadius: 10, padding: "12px 16px",
                    display: "flex", alignItems: "center", gap: 12,
                    opacity: 0.65,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, background: COLORS.border,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 800, color: COLORS.textDim, flexShrink: 0,
                    }}>
                      N{aluno.nivel}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.textMuted }}>{aluno.nome}</div>
                      <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 1 }}>
                        {TIPO_LABELS[aluno.tipo].label} · Nível {aluno.nivel} · <span style={{ color: COLORS.red }}>Inativo</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleAtivo(aluno.id)}
                      title="Reativar aluno"
                      style={{
                        background: COLORS.green + "22", color: COLORS.green,
                        border: `1px solid ${COLORS.green}44`, borderRadius: 7,
                        padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ▶ Reativar
                    </button>
                    <button onClick={() => setConfirmDelete(aluno)} style={btnIcon} title="Excluir">🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL Plano de Aula */}
      {planoModalOpen && (
        <PlanoModal
          item={editPlanoItem}
          onSave={salvarPlanoItem}
          onClose={() => { setPlanoModalOpen(false); setEditPlanoItem(null); }}
        />
      )}

      {/* MODAL Aluno */}
      {modalOpen && (
        <Modal
          aluno={editAluno}
          onSave={salvarAluno}
          onClose={() => { setModalOpen(false); setEditAluno(null); }}
          onToggleAtivo={(id) => { toggleAtivo(id); setModalOpen(false); setEditAluno(null); }}
        />
      )}

      {/* CONFIRM DELETE */}
      {confirmDelete && (
        <div style={overlayStyle}>
          <div style={{ ...modalBox, maxWidth: 340 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Remover aluno?</div>
            <div style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 20 }}>
              Tem certeza que quer remover <strong>{confirmDelete.nome}</strong>? Os registros de pagamento dele serão mantidos.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ ...btnSec, flex: 1 }}>Cancelar</button>
              <button onClick={() => deletarAluno(confirmDelete.id)} style={{ ...btnDanger, flex: 1 }}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ label, value, color }) {
  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

function Modal({ aluno, onSave, onClose, onToggleAtivo }) {
  const [form, setForm] = useState({
    nome: aluno?.nome || "",
    nivel: aluno?.nivel ?? "",
    tipo: aluno?.tipo || "aluno",
    mensalidade: aluno?.mensalidade ?? DEFAULT_MENSALIDADE,
    desconto: aluno?.desconto ?? 0,
    whatsapp: aluno?.whatsapp || "",
    aulaDupla: aluno?.aulaDupla ?? false,
    id: aluno?.id || null,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function submit() {
    if (!form.nome.trim()) return;
    if (form.nivel === "") return;
    onSave({ ...form, nivel: String(form.nivel).trim() });
  }

  return (
    <div style={overlayStyle}>
      <div style={modalBox}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20, color: COLORS.gold }}>
          {aluno ? "Editar Aluno" : "Novo Aluno"}
        </div>

        <label style={lbl}>Nome</label>
        <input style={inp} value={form.nome} onChange={e => set("nome", e.target.value)} placeholder="Nome completo" />

        <label style={lbl}>Nível / Turma</label>
        <input style={inp} value={form.nivel} onChange={e => set("nivel", e.target.value)} placeholder="Ex: 0, 1, 2, 3..." />

        <label style={lbl}>Tipo</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {Object.entries(TIPO_LABELS).map(([k, v]) => (
            <button key={k} onClick={() => set("tipo", k)} style={{
              flex: 1, padding: "8px 6px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: `1.5px solid ${form.tipo === k ? v.color : COLORS.border}`,
              background: form.tipo === k ? v.color + "22" : "transparent",
              color: form.tipo === k ? v.color : COLORS.textMuted,
              transition: "all 0.15s",
            }}>
              {v.label}
            </button>
          ))}
        </div>

        {form.tipo === "bolsista" && (
          <label style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
            cursor: "pointer", fontSize: 13, color: COLORS.textMuted,
          }}>
            <input
              type="checkbox"
              checked={form.aulaDupla}
              onChange={e => set("aulaDupla", e.target.checked)}
            />
            Aula duplicada (2x por semana — dobra a quantidade de aulas no mês)
          </label>
        )}

        {form.tipo !== "bolsista" && (
          <>
            <label style={lbl}>Valor da Mensalidade (R$)</label>
            <input style={inp} type="number" min="0" value={form.mensalidade} onChange={e => set("mensalidade", Number(e.target.value))} />

            <label style={lbl}>Desconto (R$)</label>
            <input style={inp} type="number" min="0" value={form.desconto} onChange={e => set("desconto", Number(e.target.value))} placeholder="0" />

            {(() => {
              const bruto = form.mensalidade * TIPO_LABELS[form.tipo].valor;
              const final = Math.max(0, bruto - (form.desconto ?? 0));
              return (
                <div style={{
                  fontSize: 12, color: COLORS.textMuted, marginTop: -10, marginBottom: 14,
                  padding: "8px 10px", background: COLORS.surfaceHover, borderRadius: 8,
                  borderLeft: `3px solid ${COLORS.gold}`,
                }}>
                  {form.tipo === "meio"
                    ? `Meio bolsista: R$ ${(form.mensalidade / 2).toFixed(2).replace(".",",")} `
                    : `Mensalidade cheia: R$ ${form.mensalidade.toFixed(2).replace(".",",")} `}
                  {(form.desconto ?? 0) > 0 && (
                    <span style={{ color: COLORS.green }}>
                      − R$ {(form.desconto).toFixed(2).replace(".",",")} (desconto)
                    </span>
                  )}
                  <span style={{ fontWeight: 700, color: COLORS.gold, display: "block", marginTop: 2 }}>
                    Valor final: R$ {final.toFixed(2).replace(".",",")}
                  </span>
                </div>
              );
            })()}
          </>
        )}

        <label style={lbl}>WhatsApp (opcional)</label>
        <input style={inp} value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} placeholder="Ex: 83912345678" />

        {aluno && (
          <button
            onClick={() => onToggleAtivo(aluno.id)}
            style={{
              width: "100%", marginBottom: 10, padding: "9px 0",
              borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
              border: `1px solid ${aluno.ativo === false ? COLORS.green + "66" : COLORS.red + "66"}`,
              background: aluno.ativo === false ? COLORS.green + "11" : COLORS.red + "11",
              color: aluno.ativo === false ? COLORS.green : COLORS.red,
            }}
          >
            {aluno.ativo === false ? "▶ Reativar aluno" : "⏸ Congelar / Inativar aluno"}
          </button>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button onClick={onClose} style={{ ...btnSec, flex: 1 }}>Cancelar</button>
          <button onClick={submit} style={{ ...btnPrimary, flex: 1 }} disabled={!form.nome.trim() || form.nivel === ""}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanoModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    texto: item?.texto || "",
    nivel: item?.nivel || "Zouk-0",
    secao: item?.secao || "",
    id: item?.id || null,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function submit() {
    if (!form.texto.trim() || !form.secao.trim()) return;
    onSave(form);
  }

  return (
    <div style={overlayStyle}>
      <div style={{ ...modalBox, maxWidth: 460 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20, color: COLORS.gold }}>
          {item ? "Editar Conteúdo" : "Novo Conteúdo"}
        </div>

        <label style={lbl}>Descrição do conteúdo</label>
        <textarea
          style={{ ...inp, height: 80, resize: "vertical", fontFamily: "inherit" }}
          value={form.texto}
          onChange={e => set("texto", e.target.value)}
          placeholder="Ex: Giro duplo no bônus"
        />

        <label style={lbl}>Nível</label>
        <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
          {NIVEIS_ZOUK.map(n => (
            <button key={n} onClick={() => set("nivel", n)} style={{
              flex: 1, padding: "8px 4px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer",
              border: `1.5px solid ${form.nivel === n ? NIVEL_CORES[n] : COLORS.border}`,
              background: form.nivel === n ? NIVEL_CORES[n] + "22" : "transparent",
              color: form.nivel === n ? NIVEL_CORES[n] : COLORS.textMuted,
              transition: "all 0.15s", minWidth: 60,
            }}>
              {NIVEL_EMOJI[n]} {n}
            </button>
          ))}
        </div>

        <label style={lbl}>Seção</label>
        <input
          style={inp}
          value={form.secao}
          onChange={e => set("secao", e.target.value)}
          placeholder="Ex: Movimentos Principais"
        />

        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button onClick={onClose} style={{ ...btnSec, flex: 1 }}>Cancelar</button>
          <button
            onClick={submit}
            style={{ ...btnPrimary, flex: 1, opacity: (!form.texto.trim() || !form.secao.trim()) ? 0.5 : 1 }}
            disabled={!form.texto.trim() || !form.secao.trim()}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// Styles
const btnNav = {
  background: "#27272F", border: "1px solid #3A3A46", color: "#F0EEE8",
  borderRadius: 8, width: 36, height: 36, cursor: "pointer", fontSize: 20, lineHeight: 1,
  display: "flex", alignItems: "center", justifyContent: "center",
};
const btnIcon = {
  background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: "4px 6px", borderRadius: 6,
  color: "#8A8A99", transition: "color 0.15s",
};
const overlayStyle = {
  position: "fixed", inset: 0, background: "#000000BB",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16,
};
const modalBox = {
  background: "#27272F", border: "1px solid #3A3A46", borderRadius: 14,
  padding: 24, width: "100%", maxWidth: 440,
};
const lbl = { display: "block", fontSize: 11, color: "#9A9AAA", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 };
const inp = {
  width: "100%", background: "#1E1E25", border: "1px solid #3A3A46", borderRadius: 8,
  color: "#F0EEE8", fontSize: 14, padding: "10px 12px", marginBottom: 14,
  boxSizing: "border-box", outline: "none",
};
const btnPrimary = {
  background: "#E8B84B", color: "#0D0D0F", border: "none", borderRadius: 8,
  padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer",
};
const btnSec = {
  background: "transparent", color: "#9A9AAA", border: "1px solid #3A3A46", borderRadius: 8,
  padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer",
};
const btnDanger = {
  background: "#E05C5C22", color: "#E05C5C", border: "1px solid #E05C5C44", borderRadius: 8,
  padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer",
};
