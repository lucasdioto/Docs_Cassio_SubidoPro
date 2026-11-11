/* ===== Configuração: ajuste só este bloco para cada cliente ===== */
const CONFIG = {
  // WhatsApp com DDI + DDD, só números. Ex.: "5511999998888". Vazio = sem WhatsApp.
  whatsapp: "{{WHATSAPP_NUMERO}}",
  // Mensagem que já vem escrita quando a conversa abre.
  whatsappMensagem: "{{WHATSAPP_MENSAGEM}}",
  // URL que recebe o formulário (webhook n8n/Make, Formspree, Web3Forms...).
  // Vazio = o formulário abre o WhatsApp com os dados preenchidos.
  formEndpoint: "{{FORM_ENDPOINT}}",
  // Página de obrigado (opcional). Vazio = mostra a mensagem na própria página.
  paginaObrigado: "",
};
/* ================================================================ */

window.dataLayer = window.dataLayer || [];
const evento = (nome, dados = {}) => window.dataLayer.push({ event: nome, ...dados });

// Parâmetros de campanha: guardados na sessão para sobreviver a recarregamentos.
const CHAVES_ORIGEM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];
function lerOrigem() {
  const url = new URLSearchParams(location.search);
  let origem = {};
  try { origem = JSON.parse(sessionStorage.getItem("lp_origem") || "{}"); } catch (e) {}
  CHAVES_ORIGEM.forEach((k) => { if (url.get(k)) origem[k] = url.get(k); });
  try { sessionStorage.setItem("lp_origem", JSON.stringify(origem)); } catch (e) {}
  return origem;
}
const origem = lerOrigem();

function linkWhatsApp(mensagem) {
  const ref = origem.utm_campaign ? `\n(ref: ${origem.utm_source || "ads"} / ${origem.utm_campaign})` : "";
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem + ref)}`;
}

// Botão flutuante do WhatsApp
document.querySelectorAll("[data-whatsapp]").forEach((el) => {
  if (!CONFIG.whatsapp) { el.hidden = true; return; }
  el.href = linkWhatsApp(CONFIG.whatsappMensagem);
  el.target = "_blank";
  el.rel = "noopener";
  el.addEventListener("click", () => evento("whatsapp_click", { local: "flutuante" }));
});

// Cliques nos botões de CTA
document.querySelectorAll("[data-cta]").forEach((el) => {
  el.addEventListener("click", () => evento("cta_click", { local: el.dataset.cta }));
});

// Formulário
const form = document.getElementById("form-lead");
if (form) {
  const msg = document.getElementById("form-msg");
  const aviso = (texto, tipo) => { msg.textContent = texto; msg.dataset.tipo = tipo; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(form));
    if (dados.empresa_site) return; // robô preencheu o campo-isca
    delete dados.empresa_site;

    const telefone = (dados.telefone || "").replace(/\D/g, "");
    const nomeOk = (dados.nome || "").trim().length >= 2;
    const telOk = telefone.length >= 10;
    form.nome.setAttribute("aria-invalid", String(!nomeOk));
    form.telefone.setAttribute("aria-invalid", String(!telOk));
    if (!nomeOk || !telOk) {
      aviso("Confira seu nome e o WhatsApp com DDD.", "erro");
      return;
    }

    const botao = form.querySelector("button[type=submit]");
    const textoBotao = botao.textContent;
    botao.disabled = true;
    botao.textContent = "Enviando...";

    try {
      if (CONFIG.formEndpoint) {
        const resp = await fetch(CONFIG.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...dados, ...origem, pagina: location.href }),
        });
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        evento("generate_lead", { metodo: "formulario" });
        if (CONFIG.paginaObrigado) { location.href = CONFIG.paginaObrigado; return; }
        form.reset();
        aviso("Recebemos seus dados! Em breve entraremos em contato.", "ok");
      } else if (CONFIG.whatsapp) {
        evento("generate_lead", { metodo: "whatsapp" });
        const texto = `${CONFIG.whatsappMensagem}\n\nNome: ${dados.nome}\nWhatsApp: ${dados.telefone}` +
          (dados.email ? `\nE-mail: ${dados.email}` : "");
        aviso("Abrindo o WhatsApp...", "ok");
        location.href = linkWhatsApp(texto);
      } else {
        throw new Error("Nenhum destino configurado em CONFIG");
      }
    } catch (erro) {
      console.error(erro);
      aviso("Não foi possível enviar agora. Tente novamente em instantes.", "erro");
    } finally {
      botao.disabled = false;
      botao.textContent = textoBotao;
    }
  });
}
