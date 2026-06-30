import { useState, useEffect, useMemo } from "react";

const COLORS = {
  bg: "#0D0D0F",
  surface: "#16161A",
  surfaceHover: "#1E1E24",
  border: "#2A2A33",
  gold: "#E8B84B",
  goldLight: "#F5D07A",
  goldDim: "#A07C28",
  text: "#F0EEE8",
  textMuted: "#8A8A99",
  textDim: "#555566",
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

function getValor(aluno) {
  const base = aluno.mensalidade ?? DEFAULT_MENSALIDADE;
  return base * TIPO_LABELS[aluno.tipo].valor;
}

function loadData() {
  try {
    const raw = localStorage.getItem("zoukme_v1");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { alunos: [], pagamentos: {} };
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

  const now = new Date();
  const [mesSel, setMesSel] = useState(now.getMonth());
  const [anoSel, setAnoSel] = useState(now.getFullYear());

  useEffect(() => { saveData(data); }, [data]);

  const mesKey = getMesKey(anoSel, mesSel);
  const pagMes = data.pagamentos[mesKey] || {};

  const alunosMes = useMemo(() => {
    return data.alunos.map(a => ({
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
          setData({ alunos: parsed.alunos, pagamentos: parsed.pagamentos || {} });
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

  // Agrupar por nível
  const niveisList = [...new Set(data.alunos.map(a => a.nivel))].sort((a,b) => Number(a)-Number(b));

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
          <div style={{ display: "flex", gap: 0 }}>
            {["mensal","alunos"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px 20px", fontSize: 13, fontWeight: 600,
                color: tab === t ? COLORS.gold : COLORS.textMuted,
                borderBottom: tab === t ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                transition: "all 0.15s",
                textTransform: "capitalize",
              }}>
                {t === "mensal" ? "Mensal" : "Alunos"}
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
              <Card label="Total Esperado" value={`R$ ${totalEsperado.toFixed(2).replace(".",",")}`} color={COLORS.textMuted} />
              <Card label="Arrecadado" value={`R$ ${totalPago.toFixed(2).replace(".",",")}`} color={COLORS.green} />
              <Card label="Pendente" value={`R$ ${totalPendente.toFixed(2).replace(".",",")}`} color={totalPendente > 0 ? COLORS.red : COLORS.green} />
            </div>
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
                return (
                  <div key={nivel} style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                      Nível {nivel}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {grupo.map(aluno => {
                        const link = whatsappLink(aluno);
                        return (
                          <div key={aluno.id} style={{
                            background: COLORS.surface,
                            border: `1px solid ${aluno.pago ? COLORS.green + "44" : COLORS.border}`,
                            borderRadius: 10, padding: "12px 14px",
                            display: "flex", alignItems: "center", gap: 12,
                            transition: "border 0.2s",
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
                              <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{aluno.nome}</div>
                              <div style={{ fontSize: 11, color: TIPO_LABELS[aluno.tipo].color, marginTop: 1 }}>{TIPO_LABELS[aluno.tipo].label}</div>
                            </div>
                            {/* Valor */}
                            <div style={{ fontSize: 15, fontWeight: 700, color: aluno.valor > 0 ? (aluno.pago ? COLORS.green : COLORS.text) : COLORS.textDim, marginRight: 8 }}>
                              {aluno.valor > 0 ? `R$ ${aluno.valor.toFixed(2).replace(".",",")}` : "Gratuito"}
                            </div>
                            {/* WhatsApp */}
                            {link && (
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
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB ALUNOS */}
        {tab === "alunos" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>{data.alunos.length} aluno(s) cadastrado(s)</div>
              <button onClick={() => { setEditAluno(null); setModalOpen(true); }} style={{
                background: COLORS.gold, color: "#0D0D0F", border: "none", borderRadius: 8,
                padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}>
                + Novo Aluno
              </button>
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

            {data.alunos.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.textDim }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>💃</div>
                <div style={{ fontSize: 14 }}>Nenhum aluno ainda. Adicione o primeiro!</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.alunos.map(aluno => (
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
                        {aluno.whatsapp ? ` · ${aluno.whatsapp}` : ""}
                      </div>
                    </div>
                    <button onClick={() => { setEditAluno(aluno); setModalOpen(true); }} style={btnIcon}>✏️</button>
                    <button onClick={() => setConfirmDelete(aluno)} style={btnIcon}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL Aluno */}
      {modalOpen && (
        <Modal
          aluno={editAluno}
          onSave={salvarAluno}
          onClose={() => { setModalOpen(false); setEditAluno(null); }}
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

function Modal({ aluno, onSave, onClose }) {
  const [form, setForm] = useState({
    nome: aluno?.nome || "",
    nivel: aluno?.nivel ?? "",
    tipo: aluno?.tipo || "aluno",
    mensalidade: aluno?.mensalidade ?? DEFAULT_MENSALIDADE,
    whatsapp: aluno?.whatsapp || "",
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

        {form.tipo !== "bolsista" && (
          <>
            <label style={lbl}>Valor da Mensalidade (R$)</label>
            <input style={inp} type="number" value={form.mensalidade} onChange={e => set("mensalidade", Number(e.target.value))} />
            {form.tipo === "meio" && (
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: -10, marginBottom: 14 }}>
                Meio bolsista pagará R$ {(form.mensalidade / 2).toFixed(2).replace(".",",")}
              </div>
            )}
          </>
        )}

        <label style={lbl}>WhatsApp (opcional)</label>
        <input style={inp} value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} placeholder="Ex: 83912345678" />

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

// Styles
const COLORS_REF = { bg: "#0D0D0F", surface: "#16161A", border: "#2A2A33", gold: "#E8B84B", text: "#F0EEE8", textMuted: "#8A8A99" };

const btnNav = {
  background: "#16161A", border: "1px solid #2A2A33", color: "#F0EEE8",
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
  background: "#16161A", border: "1px solid #2A2A33", borderRadius: 14,
  padding: 24, width: "100%", maxWidth: 440,
};
const lbl = { display: "block", fontSize: 11, color: "#8A8A99", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 };
const inp = {
  width: "100%", background: "#0D0D0F", border: "1px solid #2A2A33", borderRadius: 8,
  color: "#F0EEE8", fontSize: 14, padding: "10px 12px", marginBottom: 14,
  boxSizing: "border-box", outline: "none",
};
const btnPrimary = {
  background: "#E8B84B", color: "#0D0D0F", border: "none", borderRadius: 8,
  padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer",
};
const btnSec = {
  background: "transparent", color: "#8A8A99", border: "1px solid #2A2A33", borderRadius: 8,
  padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer",
};
const btnDanger = {
  background: "#E05C5C22", color: "#E05C5C", border: "1px solid #E05C5C44", borderRadius: 8,
  padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer",
};
