---
name: Sentinela
version: 1.0.0
date: 2026-06-04
tier: brand-book
project: FIAP Global Solution 2026/1 — Engenharia de Software

identity-palette:
  - role: background-primary
    name: Void
    hex: "#070D1A"
    rationale: >
      Deep-space navy-black. Absorbs ambient light and maximises the contrast
      of every semantic signal layered above it. Evokes the orbital dark that
      frames the Earth in satellite imagery.

  - role: surface-secondary
    name: Deep Atlas
    hex: "#0D1F3C"
    rationale: >
      Mid-depth navy used for panels, cards, and the operator dashboard
      background. Provides visual separation from Void without brightness
      shock, keeping the interface in the same orbital register.

  - role: accent-primary
    name: Rescue Cyan
    hex: "#00E5FF"
    rationale: >
      The brand's single most important colour. Assigned to safe routes,
      confirmed shelter markers, and positive system states. Borrowed from
      the characteristic cyan of radar returns and SAR composite imagery.
      Its luminance against Void is the highest in the palette — a
      deliberate signal that safety is the brightest thing on screen.

  - role: semantic-alert
    name: Sentinel Amber
    hex: "#FFB300"
    rationale: >
      Fire and heat-source hazard. Chosen from the thermal infrared palette
      used by MODIS/VIIRS fire-detection products. Also the brand's primary
      attention-grabbing accent for non-critical warnings, badge counts, and
      the resting state of the alert-pulse animation.

  - role: brand-identity
    name: Orbital Blue
    hex: "#1565C0"
    rationale: >
      Mid-saturation blue that bridges the dark backgrounds and the luminous
      cyan. Used for primary interactive elements (buttons, links, active tab
      indicators) and logo wordmark. Recalls the blue of ESA Sentinel orbital
      diagrams and EUMETSAT imagery thumbnails.

typefaces:
  - role: display
    name: Rajdhani
    classification: geometric-sans / techno-condensed
    license: OFL (Google Fonts)
    rationale: >
      Condensed proportions and military-stencil undertones match the
      "instrumentation / telemetry" register. Works at large sizes for
      section titles and the logo wordmark. Available via Google Fonts
      (fontsource/rajdhani for self-hosting in the SPA).

  - role: body
    name: IBM Plex Sans
    classification: humanist-grotesque
    license: OFL (Google Fonts / IBM Open Source)
    rationale: >
      Designed for technical documentation and dense data interfaces.
      Slightly mechanical but warm enough to remain human under stress.
      Excellent CJK coverage is irrelevant here; the even stroke weight
      and large x-height remain legible at 14px on a dark background —
      critical for the citizen persona reading on a dim phone screen.

  - role: mono-data
    name: IBM Plex Mono
    classification: monospace
    license: OFL
    rationale: >
      Used exclusively for coordinate readouts, timestamps, sensor data,
      and code-style status strings (e.g. "SAR COVERAGE ACTIVE"). Shares
      the Plex family's metrics so it sits harmoniously in mixed contexts
      without optical size mismatch.

known-gaps:
  - Logo artwork file not yet created. A greenfield logo brief is included
    in the Logo section below.
  - Illustration style described in prose only; no reference files provided.
  - Motion behaviour (pulse animation, route-line draw-on) is referenced but
    timing tokens are deferred to the design-language tier.
  - Colour accessibility audit (WCAG contrast ratios) is deferred to the
    design-language tier.
---

# Sentinela — Brand Book

## 1. Mission

> Sentinela transforma dados de observação da Terra por satélite em rotas de
> fuga seguras — entregando, em segundos, a informação que salva vidas durante
> enchentes, queimadas e deslizamentos.

Milhares de satélites vigiam o planeta 24 horas por dia. Radares SAR mapeiam
alagamentos em tempo real. Sensores térmicos identificam focos de calor. O
sistema InSAR detecta deformações do solo antes do deslizamento. Essa
inteligência orbital existe — mas raramente chega à pessoa que precisa dela a
tempo.

A Sentinela fecha essa lacuna. Ela é a ponte entre o espaço e o chão, entre o
dado técnico e a decisão humana, entre o perigo e a saída segura.


## 2. Positioning

**Para quem é:** cidadãos em situação de emergência e operadores de Defesa
Civil que precisam agir com rapidez em cenários de desastre natural.

**O que entrega:** rotas de fuga validadas por dados orbitais em tempo real,
evitando zonas de risco mapeadas por satélite (alagamento, fogo, deslizamento).

**Por que é diferente:** não é um app de alerta — é um guia de saída. Enquanto
outras ferramentas informam que o perigo existe, a Sentinela mostra como
contorná-lo e onde chegar em segurança.

**Conexão ODS:**
- ODS 11 (meta 11.5) — redução de mortes e afetados por desastres.
- ODS 13 (meta 13.1) — fortalecimento da resiliência climática e de desastres.

**Frase de posicionamento (para avaliadores):**
"Sentinela usa inteligência orbital para entregar a rota certa, na hora certa,
para a pessoa certa — antes que o perigo feche o caminho."


## 3. Personality

A Sentinela é uma vigia. Não dorme, não hesita, não exagera. Quando ela fala,
as pessoas ouvem — porque ela só fala quando há algo importante a dizer.

Cinco adjetivos que definem a marca:

| Adjetivo | Significado na prática |
|---|---|
| **Vigilante** | Monitoramento contínuo, sem falhas silenciosas. |
| **Confiável** | Cada dado tem proveniência; cada rota tem margem de segurança. |
| **Humana** | Lembra que do outro lado da tela há uma pessoa com medo. |
| **Técnica** | Fala o idioma da ciência de dados e da engenharia operacional. |
| **Esperançosa** | O propósito final é sempre salvar — nunca apenas alertar. |

A Sentinela não é um robô frio nem um assistente simpático demais. É o
controlador de missão calmo que guia o astronauta de volta para casa — preciso,
seguro, humano.


## 4. Voice & Tone

### Espectro de registro

```
FORMAL ◄──────────────────────────────────► CASUAL
         ●
         7/10 formal — linguagem técnica clara,
         sem gírias, sem redução de ansiedade artificial

SÉRIO ◄──────────────────────────────────► LÚDICO
   ●
   8/10 sério — situações de risco real;
   jamais minimizar, jamais levianizar
```

A voz da Sentinela é direta e nua. Frases curtas. Verbos de ação. Zero
ornamento em contexto de emergência. Em contexto de dashboard, admite mais
densidade técnica — rótulos de sensores, siglas, unidades — porque o operador
domina esse idioma.

### Princípios de voz

1. **Clareza antes de tudo.** Uma instrução ambígua durante um desastre é um
   instrução perigosa.
2. **Verbo no imperativo quando a situação exige ação.** "Siga pela Rua X" —
   não "Você pode tentar seguir pela Rua X".
3. **Nunca minimizar o risco.** Não existe "pequena chance de alagamento" —
   existe "risco moderado detectado" com dados que o sustentam.
4. **Nunca inflar o risco.** Sensacionalismo destrói confiança e paralisa.
5. **A rota é a mensagem principal.** Dados secundários ficam em segundo plano.

### Do / Don't — Tabela de tom

| Contexto | Faça | Evite |
|---|---|---|
| Alerta de risco (cidadão) | "Alagamento detectado na sua área. Rota segura disponível." | "ATENÇÃO!!! Perigo iminente!!! Saia AGORA!!!" |
| Instrução de rota (cidadão) | "Vire à esquerda na Av. Brasil. Distância: 1,2 km." | "Por favor, se possível, considere virar à esquerda..." |
| Confirmação de chegada (cidadão) | "Você chegou ao Abrigo Municipal. Capacidade disponível: 47 pessoas." | "Parabéns! Você conseguiu! Ficamos felizes que esteja seguro!" |
| Rótulo de sensor (operador) | "SAR FLOOD COVERAGE — ATUALIZADO 14:32 UTC" | "Dados de radar (pode conter imprecisões)..." |
| Estado crítico (operador) | "RISCO ELEVADO — Setor 4-B — 3 rotas bloqueadas" | "Atenção: pode haver algum problema no Setor 4-B" |
| Estado normal (operador) | "SISTEMA NOMINAL — Todos os sensores ativos" | "Tudo bem por aqui! Nenhum alerta no momento :)" |
| Microcopy de botão (cidadão) | "VER ROTA SEGURA" | "Clique aqui para ver opções de rotas disponíveis" |
| Empty state (operador) | "Nenhum evento ativo monitorado nesta região." | "Uau, que bom — parece que está tudo tranquilo!" |

### Exemplos de microcopy

**Persona: Cidadão em emergência (mobile, bateria baixa, sinal fraco)**

- Botão principal: `ROTA SEGURA AGORA`
- Subtítulo do botão: `Baseada em dados de satélite — atualizada há 4 min`
- Card de risco: `Alagamento detectado a 800 m`
- Instrução de passo: `Siga reto por 600 m. Evite Av. das Flores.`
- Destino: `Abrigo — Escola Estadual Tiradentes · 1,4 km`
- Aviso de sem sinal: `Rota salva localmente. Continua funcionando sem internet.`
- Confirmação: `Você chegou. Informe sua presença à equipe do abrigo.`

**Persona: Operador da Central de Monitoramento (desktop, multi-painel)**

- Título de painel: `MONITORAMENTO EM TEMPO REAL — REGIÃO METROPOLITANA`
- Rótulo de camada: `ENCHENTE · SENTINEL-1 SAR · 14:17 UTC`
- Badge de alerta: `CRÍTICO · 2 EVENTOS ATIVOS`
- Tooltip de zona: `Zona de inundação projetada — Revisão: 15 min`
- Rótulo de rota: `ROTA A · 3,2 km · LIVRE`
- Status de sistema: `InSAR ATIVO · Última passagem: 6h atrás`
- Despacho: `Equipe Alfa despachada — Setor 4-B · 14:22 UTC`


## 5. Logo Direction

### Conceito

O logotipo da Sentinela ancora dois símbolos em tensão criativa: o olho que
vigia (a Sentinela) e a órbita que o posiciona (o satélite Sentinel). Eles se
fundem em uma única forma.

### Briefing greenfield (nenhum logo existe ainda)

**Forma primária — o "olho orbital":**
Uma íris estilizada formada por duas elipses concêntricas desalinhadas — como
a trilha de uma órbita baixa vista de perfil. O eixo maior da elipse interna
representa a varredura de radar (um traço de linha única, a "pupila"). O
espaço entre as elipses é preenchido com um gradiente Orbital Blue → Rescue
Cyan no arco superior (lado "iluminado"), negro no arco inferior.

**Wordmark:**
`SENTINELA` em Rajdhani Bold, tracking 0.15em, tudo maiúsculo. Alinhado à
direita do símbolo em composição horizontal. Em composição empilhada, abaixo
do símbolo. A letra `S` inicial pode conter um kern ligeiramente maior para
criar uma micro-respiração entre o símbolo e o texto.

**Sub-tagline (opcional em contextos com espaço):**
`VIGILÂNCIA ORBITAL · ROTAS SEGURAS` em IBM Plex Mono, 0.08em tracking,
caixa alta, tamanho 40–50% do corpo do wordmark.

### Espaço de proteção

O espaço de proteção mínimo em todos os lados equivale à altura da letra `E`
maiúscula do wordmark. Nenhum elemento externo pode adentrar essa zona.

### Tamanhos mínimos

| Contexto | Largura mínima |
|---|---|
| Digital (favicon/app icon) | 32 × 32 px (símbolo apenas, sem wordmark) |
| Mobile header | 120 px (símbolo + wordmark horizontal) |
| Desktop header | 160 px (símbolo + wordmark horizontal) |
| Badge/patch | 80 px (símbolo apenas) |

### Variantes aprovadas

1. **Positivo sobre escuro** — símbolo bicolor (Rescue Cyan + Orbital Blue),
   wordmark em branco `#FFFFFF`. Uso padrão na interface.
2. **Monocromático claro** — símbolo e wordmark em `#FFFFFF` com opacidade 90%.
   Para sobreposição em imagens escuras de satélite.
3. **Stamp/single-color** — símbolo e wordmark em Rescue Cyan `#00E5FF`.
   Para contextos de cor única (bordado, corte a laser, documentação impressa).

### Misuse — O que nunca fazer

- Não usar o logotipo sobre fundos claros sem adaptação (a marca é dark-first).
- Não distorcer proporções do símbolo orbital.
- Não substituir Rajdhani por outra fonte no wordmark.
- Não aplicar sombra ao símbolo — a profundidade vem do gradiente, não de
  efeitos externos.
- Não usar o logotipo colorido sobre fundos com muita cor saturada — a legibilidade
  do símbolo depende do contraste com o fundo.
- Não adicionar contorno (stroke) ao símbolo.


## 6. Imagery Direction

### Faixa primária — Imagens de satélite

A fonte de imagem mais autêntica para a Sentinela é a imagem de satélite real
ou hiper-realista. Composições RGB falsas de dados Sentinel-2, produtos SAR
coloridos de Sentinel-1, e imagens térmicas MODIS estão no espírito certo.

**Critérios de seleção:**

- Ângulo nadir (vista de cima) ou levemente oblíquo — nunca foto aérea de drone
  em ângulo baixo.
- Paleta predominantemente escura ou tratada para escuro via filtro overlay.
- Detalhes de grade ou graticule visíveis (linhas de coordenada) adicionam
  autenticidade de instrumento.
- Imagens de cidade/região com traçado viário visível são preferíveis às imagens
  rurais, pois conectam o dado orbital ao contexto humano.

**Tratamento obrigatório:**

Aplicar um vignette radial escuro (Void `#070D1A` a 60% de opacidade nas bordas)
para fundir a imagem com o fundo da interface. Imagens não tratadas não devem
aparecer sem essa sobreposição.

### Faixa secundária — Ilustração vetorial técnica

Para contextos onde imagem fotográfica não está disponível ou não é adequada
(onboarding, empty states, documentação), usar ilustração vetorial com estética
de diagrama de engenharia:

- Linhas finas (1–2 px equivalente) em Rescue Cyan sobre fundo Void.
- Motivos: órbitas elípticas, traços de varredura de radar (arcos equidistantes
  emanando de um ponto), grades de coordenadas, ícones de satélite em wireframe,
  pontos de luz pulsante representando sensores ativos.
- Gradiente de profundidade: elementos mais distantes em opacidade 20–40%,
  elementos em foco em 80–100%.
- Sem gradientes de preenchimento em formas fechadas — a estética é de linha
  e ponto, não de sólido colorido.

### Fotografia de pessoas

Usada exclusivamente em contextos editoriais (sobre o projeto, equipe,
parceiros institucionais). Nunca em contexto de produto ou mapa.

**Regra de tratamento:** preto-e-branco com overlay sutil de Orbital Blue
`#1565C0` a 15% de opacidade. Nunca colorida sem tratamento.

### Proibições de imagem

- Nenhuma foto de stock de "pessoa feliz ao telefone".
- Nenhuma imagem de desastre que reforce catástrofe sem caminho de saída —
  a Sentinela não vende o medo, vende a rota de saída.
- Nenhuma imagem de drone em ângulo oblíquo baixo que não seja vista de satélite.
- Nenhuma composição com fundo branco ou claro.


## 7. Iconography

### Biblioteca base

Usar **Phosphor Icons** (MIT, disponível via CDN ou npm) como biblioteca de
ícones do sistema. A família oferece variante `regular` (stroke 1.5 px) e
`bold` (stroke 2 px) que mapeiam para os dois contextos de uso:

- `regular` — interface de operador (densidade alta, ícones em 16–20 px).
- `bold` — interface de cidadão (clareza máxima, ícones em 24–32 px).

### Grade e stroke

Todos os ícones são construídos sobre grade de 256 × 256 px (equivalente a
24 × 24 px na interface). Stroke width padrão: 1.5 px no contexto regular,
2 px no contexto bold. Cantos arredondados com raio de 2 px nas terminações
de linha (`stroke-linecap: round; stroke-linejoin: round`).

### Ícones de sistema definidos pela marca

| Ícone | Símbolo Phosphor sugerido | Cor | Uso |
|---|---|---|---|
| Rota segura | `ArrowLineRight` (bold) | Rescue Cyan `#00E5FF` | CTA principal do cidadão |
| Enchente | `Waves` (regular) | `#1E88E5` (azul-água) | Camada de risco SAR |
| Fogo/Queimada | `Fire` (regular) | Sentinel Amber `#FFB300` | Camada de risco térmico |
| Deslizamento | `Mountains` (regular) | `#8D6E63` (terra-marrom) | Camada de risco InSAR |
| Satélite | `Aperture` (regular) | Orbital Blue `#1565C0` | Status de sensor |
| Abrigo/Destino | `House` (bold) | Rescue Cyan `#00E5FF` | Pin de destino seguro |
| Alerta ativo | `WarningCircle` (bold) | Sentinel Amber `#FFB300` | Badge de evento |
| Sistema nominal | `CheckCircle` (regular) | Rescue Cyan `#00E5FF` | Status de saúde |
| Radar/Varredura | `Radar` (regular) | Orbital Blue `#1565C0` | Painel de sensor |
| Localização | `MapPin` (bold) | `#FFFFFF` | Posição do usuário |

### Uso de cor em ícones

Ícones em contexto de interface nunca usam mais de uma cor. Ícones de risco
recebem sua cor semântica. Ícones de interface geral (fechar, menu, busca)
são sempre brancos `#FFFFFF` em opacidade 80%.

### Escala de tamanhos

| Contexto | Tamanho |
|---|---|
| Dado compacto / tabela (operador) | 16 px |
| Botão inline / label (ambos) | 20 px |
| Card / listagem | 24 px |
| CTA principal (cidadão) | 32 px |
| Hero / empty state | 48–64 px |


## 8. Identity Palette — Referência Expandida

A paleta de identidade definida no frontmatter é estendida aqui com papéis
semânticos adicionais que derivam das cinco cores-base.

### Cores de risco (derivadas, não independentes)

Estas cores são semânticas e derivam de convenções estabelecidas em
sensoriamento remoto e meteorologia. Elas não existem de forma independente
da paleta de identidade — são aplicações derivadas.

| Papel | Nome | Hex | Derivação |
|---|---|---|---|
| Risco de enchente | Flood Blue | `#1E88E5` | Azul de imagem SAR tratada (mais saturado que Orbital Blue, menos luminoso que Rescue Cyan) |
| Risco de fogo | Fire Amber | `#FFB300` | Idêntico a Sentinel Amber — a cor de alerta e a cor de fogo são intencionalmente a mesma |
| Risco de deslizamento | Landslide Earth | `#8D6E63` | Marrom-terra médio, leitura clara sobre Void sem vibrar |
| Zona de exclusão crítica | Danger Red | `#E53935` | Reservado para bloqueio total de rota e alertas CRÍTICO nível máximo |

### Hierarquia de opacidades (surfaces)

Derivadas de Orbital Blue `#1565C0`:

| Token semântico | Equivalente visual | Uso |
|---|---|---|
| `surface/overlay-low` | Orbital Blue @ 8% | Hover state de cards |
| `surface/overlay-mid` | Orbital Blue @ 16% | Painel selecionado, estado ativo |
| `surface/overlay-high` | Orbital Blue @ 32% | Modal backdrop, tray overlay |

Derivadas de Void `#070D1A`:

| Token semântico | Equivalente visual | Uso |
|---|---|---|
| `surface/glass` | Void @ 80% + blur | Elementos flutuantes sobre mapa |
| `surface/panel` | Deep Atlas `#0D1F3C` | Painéis laterais, cards de dado |


## 9. Tipografia — Referência Expandida

### Escala de tamanhos sugerida (a ser formalizada no design-language tier)

| Papel | Fonte | Tamanho base | Peso |
|---|---|---|---|
| Display / hero | Rajdhani | 48–72 px | 700 (Bold) |
| Título de seção | Rajdhani | 28–36 px | 600 (SemiBold) |
| Título de card | Rajdhani | 20–24 px | 600 (SemiBold) |
| Corpo principal | IBM Plex Sans | 16 px | 400 (Regular) |
| Corpo compacto (operador) | IBM Plex Sans | 14 px | 400 (Regular) |
| Label / caption | IBM Plex Sans | 12 px | 500 (Medium) |
| Dado / coordenada | IBM Plex Mono | 13–14 px | 400 (Regular) |
| Status crítico | IBM Plex Mono | 11–12 px | 700 (Bold) |

### Importação no SPA (CSS / fontsource)

```css
/* Opção A — Google Fonts CDN (desenvolvimento) */
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=IBM+Plex+Sans:wght@400;500;700&family=IBM+Plex+Mono:wght@400;700&display=swap');

/* Opção B — fontsource self-hosted (produção recomendada) */
/* npm install @fontsource/rajdhani @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono */
```

### CSS Variables de fonte (seed para design-language tier)

```css
:root {
  --font-display:  'Rajdhani', sans-serif;
  --font-body:     'IBM Plex Sans', sans-serif;
  --font-mono:     'IBM Plex Mono', monospace;
}
```


## 10. Aplicações de Referência (sem imagens embutidas)

As seguintes referências visuais inspiram a direção da Sentinela. Nenhum
arquivo é embutido — são descrições de referência para o time de design.

### Referências de interface

- **NASA Worldview** (worldview.earthdata.nasa.gov) — density de dados orbitais
  sobre mapa escuro, paleta de produto de sensoriamento remoto.
- **Copernicus Emergency Management Service** (emergency.copernicus.eu) —
  linguagem visual de gestão de crise baseada em dados Sentinel.
- **ICEYE Flood Insights** — estética dark com overlay de risco em azul sobre
  fundo cartográfico escuro; inspiração direta para a camada de enchente.
- **Dark Sky (app legado)** — simplicidade de apresentação de dado meteorológico
  para usuário comum; modelo para a interface do cidadão.

### Referências de identidade visual

- **ESA brand identity** — combinação de azul corporativo com formas orbitais
  geométricas; ponto de partida para o símbolo do logotipo.
- **Grafana** — tipografia Rajdhani em dashboards de monitoramento; validação
  do uso técnico da fonte.


## 11. Seed para Design-Language Tier

Quando `design/brand/brand-book.md` for detectado pelo tier de design-language,
os seguintes valores são os pontos de partida canônicos:

```yaml
# Seed mínimo para design-language — expandir com scale completa
background: "#070D1A"
surface:    "#0D1F3C"
accent:     "#00E5FF"
warning:    "#FFB300"
interactive: "#1565C0"

font-display: "Rajdhani"
font-body:    "IBM Plex Sans"
font-mono:    "IBM Plex Mono"

theme: dark-first
```


## 12. Known Gaps

Os itens abaixo são decisões que ficam em aberto até validação com o time de
design ou a banca avaliadora. Uma versão default está implementada acima;
estas são opções alternativas para consideração.

### Decisões em aberto para o usuário

1. **Cor de risco para deslizamento:** Landslide Earth `#8D6E63` foi escolhido
   por diferenciação máxima das outras cores de risco. Alternativa: `#A1887F`
   (mais claro, melhor contraste sobre Void mas mais próximo do amber) ou
   `#6D4C41` (mais escuro, menos visível em zoom baixo).

2. **Segundo acento da paleta de identidade:** A paleta atual usa Rescue Cyan
   como único acento quente. Se a banca avaliar que a paleta precisa de mais
   "vida", pode-se promover Sentinel Amber `#FFB300` a acento-secundário com
   uso sistemático em destaques não-semânticos. Por ora está limitado a uso
   semântico (fogo/alerta).

3. **Tagline do logo:** A sub-tagline `VIGILÂNCIA ORBITAL · ROTAS SEGURAS`
   é funcional mas longa. Alternativas mais concisas:
   - `DO ESPAÇO AO CHÃO`
   - `ORBIT TO GROUND` (inglês técnico, mais internacional)
   - `DADOS ORBITAIS. ROTAS REAIS.`

4. **Fonte de display alternativa:** Se Rajdhani for considerada muito
   "gaming/militar" pela banca, a alternativa mantendo o registro técnico é
   **Barlow Condensed** (OFL, Google Fonts) — mais neutro, menos estilizado,
   com o mesmo comportamento condensado em títulos grandes.
