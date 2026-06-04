# Roteiro do Vídeo Pitch — Sentinela

**FIAP Global Solution 2026/1 · até 3 min · vale 5 pontos**

> Produção pensada para o **Google Veo (Flow)**, que gera clipes de **8 segundos**.
> Por isso o roteiro é quebrado em **cenas de ≤8s**, com uma **bíblia de
> continuidade** (personagens, cenário, paleta) para as transições ficarem suaves.
> Como um serviço externo gera o vídeo, as **telas do app** estão descritas com
> precisão (cores, layout, dinâmica, mobile e desktop) para serem reproduzidas
> fielmente. **Total estimado: ~2 min 24 s** (18 cenas), deixando margem dos 3 min.

---

## 1. Bíblia de continuidade (manter IGUAL em todas as cenas)

### Personagens

**Marina (a cidadã)** — mulher, ~32 anos, pele morena, cabelo escuro preso em
rabo de cavalo, **jaqueta corta-vento amarela** (sobre camiseta cinza), calça
jeans escura. Segura um **smartphone preto**. Expressão: tensa no início,
aliviada no fim. Aparece nas cenas 6, 7, 8, 12.

**Carlos (o operador da Defesa Civil)** — homem, ~45 anos, barba grisalha curta,
**camisa polo azul-marinho** com um pequeno emblema no peito, **headset** com
microfone. Sentado numa central de monitoramento. Aparece nas cenas 9, 10.

**Equipe de resgate** — dois socorristas de **uniforme laranja-segurança** com
faixas refletivas, numa caminhonete branca de resgate. Cenas 11, 12.

### Paleta (cores exatas — usar no grading de cor e nas telas)

| Papel | Hex | Uso |
|---|---|---|
| Fundo "deep space" | `#070D1A` | fundo de todas as telas e dos cartões de título |
| Superfície | `#0D1F3C` | painéis/cards |
| Ciano "resgate" | `#00E5FF` | acento, **rota segura**, pino de abrigo, logo |
| Âmbar "sentinela" | `#FFB300` | alerta/fogo, **pino do cidadão (origem)** |
| Azul orbital | `#1565C0` | detalhes |
| Risco enchente | `#1E88E5` | polígono de enchente no mapa |
| Risco fogo | `#FFB300` | foco de calor |
| Risco deslizamento | `#8D6E63` | encosta |
| Perigo | `#E53935` | crítico |

**Tipografia:** títulos em **Rajdhani** (geométrica, caixa alta, ar de HUD/painel
de missão); corpo em **IBM Plex Sans**; números/telemetria em **IBM Plex Mono**.

### Estética geral

Cinematográfico, tom sério e esperançoso. Escuro, com brilhos de ciano. Motivos
recorrentes: órbitas, varredura de radar, grade de coordenadas, ponto-de-luz
"satélite". Transições por **corte limpo** ou leve *match-cut* (do ponto de luz
do satélite para o pino no mapa, p.ex.). Música: tensão crescente → resolução
esperançosa.

### Especificação das telas do app (para reproduzir fielmente)

Todas as telas têm **fundo `#070D1A`** e uma **barra de topo** com o logo
"🛰️ SENTINELA" (Rajdhani, branco) à esquerda, menu ("Início · Alertas globais ·
Central · Pedir resgate · Chamados · Sobre") e, à direita, uma **pílula "AO VIVO"**
verde-ciano.

- **HOME (desktop):** herói escuro; chip ciano "📡 Economia espacial a serviço da
  vida"; título grande em Rajdhani **"Do espaço ao chão: rotas seguras quando o
  desastre chega."**; dois botões — **ciano preenchido** "Abrir central de
  monitoramento" e contornado "Pedir resgate"; dois selos ODS: **ODS 11 laranja
  (`#FD9D24`)** e **ODS 13 verde (`#3F7E44`)**. Abaixo, 3 cartões "Como funciona".

- **CENTRAL (desktop):** layout em duas colunas. Esquerda: barra de busca
  arredondada ("Buscar cidade ou região"), uma **faixa de telemetria** escura com
  ponto ciano pulsante e texto mono **"DADOS AO VIVO · NASA EONET · OSM"**, e um
  **mapa Leaflet escuro** (ruas reais, estilo escuro) com **polígono azul `#1E88E5`
  de enchente**, **pinos ciano `#00E5FF`** (abrigos) e chips de camada (🌊 🔥 ⛰️) +
  "🧪 Cenário de simulação". Direita: painel "Chamados recebidos" com cards.

- **CIDADÃO (mobile, retrato):** título "Pedir resgate"; formulário com campos
  "Seu nome", "CPF ou RG (opcional)", "Situação" (dropdown) e botão **ciano grande
  "🆘 Pedir resgate"**; abaixo, o mapa com **pino âmbar `#FFB300` (você)**. Após
  pedir, uma **linha ciano `#00E5FF` (rota)** se desenha pelas ruas contornando o
  polígono azul de enchente até um pino ciano (abrigo).

- **CHAMADOS (desktop):** card do chamado com nome, **badge de status** e linha
  mono "abrigo · 1.0 km · 3 min"; à direita, **linha do tempo** vertical
  **Pendente → Em rota → Concluído**, com o passo atual em ciano.

---

## 2. Roteiro cena a cena (cada cena ≤ 8 s)

> Para cada cena: **VISUAL** (prompt pronto pro Veo) · **NARRAÇÃO** (voz em PT-BR)
> · **TEXTO NA TELA** · **CONTINUIDADE** (o que repetir da cena anterior).

---

### Cena 1 — O desastre (0:00–0:08) · GANCHO
- **VISUAL:** Entardecer chuvoso. Bairro residencial baixo com a água barrenta de
  uma enchente subindo nas ruas; postes piscando, reflexos. Câmera baixa, tensa,
  leve câmera na mão. Paleta fria, azulada, pingos na lente.
- **NARRAÇÃO:** "Quando o desastre chega, cada minuto decide quem chega em segurança."
- **TEXTO:** — (nenhum)
- **CONTINUIDADE:** estabelece a cidade alagada (mesma usada na cena 11–12) e a
  paleta azul-fria.

### Cena 2 — Subida ao espaço (0:08–0:16)
- **VISUAL:** A câmera sobe verticalmente do bairro alagado, atravessa as nuvens e
  o céu escurece até o **espaço**: a Terra à noite, com luzes das cidades. Um
  **satélite** entra em quadro, painéis solares, girando devagar.
- **NARRAÇÃO:** "A resposta começa a 700 km de altitude."
- **TEXTO:** — 
- **CONTINUIDADE:** transição contínua de baixo (cena 1) para cima; mesma hora
  (entardecer→noite).

### Cena 3 — O satélite enxerga (0:16–0:24)
- **VISUAL:** POV do satélite olhando a Terra. Uma **varredura de radar ciano**
  passa sobre a região; aparecem **manchas azuis (enchente)** e **laranjas
  (fogo)** sobre o mapa, com pequenas etiquetas de dados em fonte mono.
- **NARRAÇÃO:** "Satélites já detectam enchentes, queimadas e deslizamentos em
  tempo real."
- **TEXTO (mono, canto):** `NASA EONET · DADOS ORBITAIS`
- **CONTINUIDADE:** ciano `#00E5FF` da varredura = mesmo ciano da marca/rota.

### Cena 4 — O problema (0:24–0:32)
- **VISUAL:** Split sutil: de um lado o dado orbital brilhando; do outro, Marina no
  bairro alagado olhando o celular sem informação útil (tela genérica de mapa
  comum). Uma "lacuna" escura entre os dois lados.
- **NARRAÇÃO:** "Mas esse dado quase nunca chega a quem está em perigo. A Sentinela
  fecha essa lacuna."
- **TEXTO:** —
- **CONTINUIDADE:** primeira aparição de Marina (jaqueta amarela, rabo de cavalo,
  celular preto) — fixar o visual dela.

### Cena 5 — Revelação da marca (0:32–0:40) · TÍTULO
- **VISUAL:** Fundo **`#070D1A`** (deep space) com partículas/órbitas sutis. O
  **logo "🛰️ SENTINELA"** surge em Rajdhani branco, com um anel ciano orbitando um
  ponto. Subtítulo aparece embaixo.
- **NARRAÇÃO:** "Sentinela. Do espaço ao chão."
- **TEXTO:** **SENTINELA** / *Vigilância Orbital · Rotas Seguras*
- **CONTINUIDADE:** fundo e ciano idênticos aos das telas do app (próximas cenas).

### Cena 6 — Marina pede ajuda (0:40–0:48) · TELA CIDADÃO (mobile)
- **VISUAL:** Close no smartphone de Marina (mão com a jaqueta amarela ao fundo,
  chuva). Na tela, o app Sentinela na **tela CIDADÃO em modo retrato**: título
  "Pedir resgate", campos "Seu nome" e "Situação", mapa escuro abaixo. Interface
  exatamente como a especificação (fundo `#070D1A`, botão ciano).
- **NARRAÇÃO:** "Quem precisa de ajuda abre o app e diz onde está."
- **TEXTO:** —
- **CONTINUIDADE:** Marina e o celular preto continuam; a UI deve bater com a
  especificação (cores/fontes).

### Cena 7 — Marcar local + formulário (0:48–0:56) · TELA CIDADÃO (mobile)
- **VISUAL:** Dedo toca o mapa escuro: surge um **pino âmbar `#FFB300`** ("Você
  está aqui"). O formulário mostra "Marina", situação "Ilhado / preso". Pinos
  **ciano** de abrigos aparecem no mapa; um **polígono azul `#1E88E5`** de enchente
  marca a zona de risco perto dela.
- **NARRAÇÃO:** "O satélite mostra onde é perigoso passar."
- **TEXTO (no app):** `Local marcado · Enchente detectada`
- **CONTINUIDADE:** mesmo enquadramento do celular da cena 6; pino âmbar = origem.

### Cena 8 — A rota segura se desenha (0:56–1:04) · TELA CIDADÃO (mobile) · MOMENTO-CHAVE
- **VISUAL:** Marina toca o botão **ciano "🆘 Pedir resgate"**. Uma **linha ciano
  `#00E5FF`** se **anima desenhando pelas ruas reais**, claramente **contornando o
  polígono azul de enchente**, do pino âmbar até um pino ciano (abrigo). Pequeno
  toast "Resgate solicitado — rota segura traçada".
- **NARRAÇÃO:** "Em segundos, uma rota real que desvia do risco até o abrigo mais
  próximo."
- **TEXTO (toast):** `Rota segura traçada`
- **CONTINUIDADE:** a linha ciano é o "herói visual" — repetir esse ciano na cena 11.

### Cena 9 — A central recebe (1:04–1:12) · TELA CENTRAL (desktop)
- **VISUAL:** Carlos (polo azul-marinho, headset) numa sala escura de monitoramento,
  telas grandes. Em destaque, a **tela CENTRAL em desktop**: mapa escuro à esquerda
  com polígono azul e pinos ciano, faixa **"DADOS AO VIVO"** com ponto ciano
  pulsante; à direita, o **card do chamado de "Marina" aparecendo** na lista.
- **NARRAÇÃO:** "Na central da Defesa Civil, o chamado chega na hora."
- **TEXTO (faixa):** `DADOS AO VIVO · NASA EONET · OSM`
- **CONTINUIDADE:** primeira aparição de Carlos — fixar visual; mesma região/mapa
  da cena 8.

### Cena 10 — Despacho (1:12–1:20) · TELA CENTRAL (desktop)
- **VISUAL:** Carlos clica no card "Marina" e no botão **"Despachar equipe"**. O
  **badge de status muda de "Pendente" (âmbar) para "Em rota" (ciano)**. A mesma
  rota ciano aparece destacada no mapa da central.
- **NARRAÇÃO:** "Uma equipe é enviada pela rota mais segura — não pela mais curta."
- **TEXTO (badge):** `Pendente → Em rota`
- **CONTINUIDADE:** rota ciano idêntica à da cena 8.

### Cena 11 — O resgate na rua (1:20–1:28)
- **VISUAL:** Caminhonete branca de resgate com dois socorristas de **uniforme
  laranja** avança por uma rua **seca e elevada**, enquanto ao lado/ao fundo se vê
  a área alagada (azulada) que a rota evitou. Sobreposição sutil da linha ciano
  guiando o caminho (como um HUD).
- **NARRAÇÃO:** "A tecnologia espacial vira decisão no asfalto."
- **TEXTO:** —
- **CONTINUIDADE:** mesma cidade alagada da cena 1; linha ciano sobreposta = a rota.

### Cena 12 — Chegada em segurança (1:28–1:36) · EMOÇÃO
- **VISUAL:** Marina (jaqueta amarela) chega a um **abrigo** iluminado, recebida
  pela equipe laranja; alívio no rosto. Luz mais quente pela primeira vez.
- **NARRAÇÃO:** "Marina chega em segurança. É disso que se trata."
- **TEXTO (toast no celular dela):** `Cidadão em segurança · Concluído`
- **CONTINUIDADE:** Marina idêntica; transição de tom frio → quente.

### Cena 13 — Status concluído (1:36–1:44) · TELA CHAMADOS (desktop)
- **VISUAL:** Tela CHAMADOS: a **linha do tempo Pendente → Em rota → Concluído**
  com o passo **"Concluído" aceso em verde-ciano**; card de Marina com "1.0 km ·
  3 min".
- **NARRAÇÃO:** "Cada chamado, do alerta à conclusão, em um só lugar."
- **TEXTO:** `Pendente · Em rota · Concluído`
- **CONTINUIDADE:** UI fiel à especificação.

### Cena 14 — Não é só uma cidade (1:44–1:52) · TELA ALERTAS GLOBAIS (desktop)
- **VISUAL:** Tela ALERTAS GLOBAIS: grade de cards de **eventos reais da NASA
  EONET** (🌊 enchentes, 🔥 queimadas) com botões "Ver no mapa". Zoom out para um
  globo com vários pontos acendendo no mundo.
- **NARRAÇÃO:** "Os mesmos dados cobrem o planeta inteiro — de qualquer desastre,
  em qualquer lugar."
- **TEXTO (mono):** `NASA EONET · eventos ao vivo`
- **CONTINUIDADE:** ciano e fundo deep-space.

### Cena 15 — Como funciona, em 3 passos (1:52–2:00)
- **VISUAL:** Três ícones encadeados sobre o fundo escuro: **🛰️ satélite → 🆘
  chamado → 🧭 rota**, conectados por uma linha ciano que se desenha. Estilo
  infográfico limpo, Rajdhani.
- **NARRAÇÃO:** "Satélite detecta. Cidadão pede. Rota segura salva."
- **TEXTO:** `Detecta · Pede · Salva`
- **CONTINUIDADE:** mesmos ícones/emoji das telas.

### Cena 16 — Impacto e ODS (2:00–2:08)
- **VISUAL:** Os dois selos **ODS 11 (laranja `#FD9D24`)** e **ODS 13 (verde
  `#3F7E44`)** surgem sobre o fundo escuro, com uma frase de impacto. Terra ao
  fundo.
- **NARRAÇÃO:** "Menos vidas perdidas em desastres. Mais resiliência ao clima.
  ODS 11 e 13."
- **TEXTO:** **ODS 11** · **ODS 13**
- **CONTINUIDADE:** cores oficiais dos ODS exatamente como no app.

### Cena 17 — Tecnologia real (2:08–2:16) · CREDIBILIDADE
- **VISUAL:** Fundo escuro com os **logos/nomes das fontes** aparecendo em sequência
  rápida, em mono: NASA EONET · OpenStreetMap · OpenRouteService. Pequenos prints
  reais do mapa ao fundo.
- **NARRAÇÃO:** "Tudo com dados abertos e reais — rodando num site leve, em HTML,
  CSS e JavaScript."
- **TEXTO (mono):** `NASA EONET · OpenStreetMap · OpenRouteService`
- **CONTINUIDADE:** prints reais = as telas já mostradas.

### Cena 18 — Fechamento (2:16–2:24) · CTA
- **VISUAL:** Volta ao fundo deep-space com o **logo SENTINELA** e o anel orbital
  ciano. Tagline e uma chamada final. Fade suave.
- **NARRAÇÃO:** "Sentinela. Quando o céu vigia, a Terra fica mais segura."
- **TEXTO:** **SENTINELA** / *Vigilância Orbital · Rotas Seguras* / `Grupo 11 — FIAP GS 2026/1`
- **CONTINUIDADE:** idêntico à cena 5 (abre e fecha com a marca).

---

## 3. Dicas de produção

- **Continuidade entre clipes do Veo:** comece cada prompt repetindo a descrição
  fixa do personagem/cenário da bíblia (cole o parágrafo do personagem no prompt).
  Gere a cena seguinte usando o **último frame** da anterior como referência quando
  o Veo permitir, para o *match-cut* ficar suave.
- **Telas do app:** se o Veo não reproduzir a UI com fidelidade, **grave a tela real**
  do protótipo (abrindo `ship/index.html`) para as cenas 6, 7, 8, 9, 10, 13, 14 e
  faça composição (a pessoa segurando o celular / a tela da central). Isso garante
  que as cores e dinâmicas sejam exatamente as do site — e é mais convincente para
  a banca ("é o protótipo de verdade").
- **Voz:** narração em PT-BR, tom calmo e confiante; evite ler o texto da tela.
- **Música:** tensão crescente nas cenas 1–4, virada na 5 (marca), resolução
  esperançosa da 12 em diante.
- **Duração:** ~2:24 deixa folga; se cortar, una 15+17. Não ultrapasse 3:00.
- **Entrega:** suba em YouTube/Drive/Vimeo e cole o link no `ship/entrega.txt`.
