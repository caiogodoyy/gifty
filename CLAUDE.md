# CLAUDE.md - Soma Fitness AI Telegram Bot ($0 Stack - Privado)

## Visão Geral do Projeto
**Soma** é um assistente de IA ultra-simples e privado via Telegram para acompanhamento de dieta e treino exclusivo para **Caio** e **Bel**. 

O sistema opera a custo zero ($0/mês). Para minimizar a complexidade da aplicação, **os dados estáticos (metas e treinos) ficam definidos em arquivo de código (`profiles.py`)**, enquanto o banco de dados (Supabase) armazena apenas o vínculo do Telegram ID e os registros de consumo diário.

---

## Arquitetura de Dados e Perfis Estáticos (`profiles.py`)

### Prompt de Sistema Base (Persona)
> "Você é o **Soma**, um especialista fitness atualizado com base nos estudos científicos mais recentes que envolvem Ortopedia, Fisiologia do Exercício, Nutrição Esportiva e Bioquímica Nutricional, Biomecânica e Cinesiologia, Endocrinologia e Cronobiologia e Ciência da Recuperação."

---

### Definição dos Perfis em Código

```python
# profiles.py

PERFIS = {
    "bel": {
        "nome": "Bel",
        "meta_calorias": 1700,
        "meta_proteina": 120,
        "meta_gordura": 60,
        "meta_carboidrato": 170,
        "dados": "Mulher, 24 anos, 1,68m, 60kg, ~21,8% gordura. Estudante de Medicina.",
        "objetivo": "Recomposição corporal (perder gordura em coxas/braços mantendo massa magra e foco cognitivo).",
        "treinos": {
            "Segunda": "Treino A (Quad/Glúteo): Agachamento Búlgaro/Livre (3x8-10), Leg Press 45° (3x10-12), Cadeira Extensora (3x12-15 c/ pausa 1s), Elevação Pélvica c/ Barra (4x10-12), Cadeira Abdutora (3x15-20) + Cárdio LISS (25-30 min).",
            "Terça": "Pilates (Core, Mobilidade, Estabilidade).",
            "Quarta": "Pilates (Postura e Resistência Localizada).",
            "Quinta": "Treino B (Superiores/Braços): Puxada Alta Neutra (3x10-12), Remada Baixa Triângulo (3x10-12), Desenvolvimento Halteres (3x10-12), Elevação Lateral Polia/Halteres (4x12-15), Tríceps Corda (3x12-15), Rosca Alternada (3x12-15) + Cárdio LISS (25-30 min).",
            "Sexta": "Treino C (Posterior/Glúteo): Stiff Halteres (3x8-10), Mesa Flexora (3x10-12), Cadeira Flexora (3x12-15), Glúteo Polia (3x12-15), Panturrilha em Pé (4x15) + Cárdio LISS (25-30 min).",
            "Sábado": "Descanso Total / Recuperação.",
            "Domingo": "Descanso Total / Recuperação."
        }
    },
    "caio": {
        "nome": "Caio",
        "meta_calorias": 2350,
        "meta_proteina": 170,
        "meta_gordura": 70,
        "meta_carboidrato": 260,
        "dados": "Homem, 24 anos, 1,83m, 80kg. Engenheiro de Software (40h/semana).",
        "objetivo": "Perda de gordura abdominal, hipertrofia de peitoral e condicionamento para futebol.",
        "treinos": {
            "Segunda": "Peitoral, Ombro Anterior/Lateral e Tríceps: Supino Reto Barra/Halter (4x6-8), Supino Inclinado Halter (4x8-10), Crossover Polia (3x10-12), Desenvolvimento Halter (3x8-10), Elevação Lateral (4x12-15), Tríceps Testa/Corda (3x10-12) + Caminhada inclinada (15-20 min).",
            "Terça": "Costas, Bíceps e Core: Puxada Alta Articulada (4x8-10), Remada Curvada/Baixa (4x8-10), Crucifixo Invertido/Face Pull (3x12-15), Rosca Direta Barra W (3x10-12), Rosca Martelo (3x10-12), Abdominal Infra/Prancha (3x12-15 ou 45s) + Caminhada inclinada (15-20 min).",
            "Quarta": "Futebol: Condicionamento/HIIT nativo. Aquecimento dinâmico obrigatório de 10 min.",
            "Quinta": "Pernas Completas: Agachamento Livre/Leg Press 45° (4x8-10), RDL Stiff (3x8-10), Cadeira Extensora (3x10-12), Mesa Flexora (3x10-12), Gêmeos em Pé (4x12-15).",
            "Sexta": "Descanso Total.",
            "Sábado": "Tronco Superior (Foco Peitoral): Supino Inclinado Barra (4x8-10), Paralelas ou Supino Reto Halter (3x8-10), Remada Serrote (3x8-10), Elevação Lateral (4x12-15), Super-série Rosca Alternada + Tríceps Francês (3x10-12) + Caminhada inclinada (15-20 min).",
            "Domingo": "Descanso Total."
        },
        "neat": "Meta de 8.000 a 10.000 passos diários (pausas a cada 1h no trabalho)."
    }
}

```

---

## Fluxo de Onboarding e Autenticação no Telegram

1. **Checagem Inicial:**
* A cada nova mensagem, o sistema consulta a tabela `usuarios` no Supabase filtrando pelo `telegram_id`.
* Se o ID **não existir**, o bot envia a mensagem de onboarding:
> *"Olá! Sou o **Soma**. Para configurarmos seu acesso, me diga: estou falando com o **Caio** ou com a **Bel**?"*




2. **Vinculação do Perfil:**
* Ao receber a resposta ("Caio" ou "Bel"), salva-se o registro na tabela `usuarios` (`telegram_id`, `perfil`: `"caio"` ou `"bel"`).
* Nas mensagens seguintes, o bot recupera o perfil vinculado e injeta as regras e metas contidas em `profiles.py`.



---

## Estrutura Enxuta do Banco de Dados (Supabase)

### Tabela: `usuarios`

* `telegram_id`: bigint (PK)
* `perfil`: text (`"caio"` ou `"bel"`)
* `created_at`: timestamptz (Padrão: `NOW()`)

### Tabela: `registro_diario`

* `id`: uuid (PK, Padrão: `gen_random_uuid()`)
* `telegram_id`: bigint (FK -> usuarios.telegram_id)
* `data`: date (Padrão: `CURRENT_DATE`)
* `calorias_consumidas`: int (Padrão: 0)
* `proteina_consumida`: int (Padrão: 0)

---

## Diretrizes e Regras de Negócio da IA

1. **Gestão de Dieta:**
* **Regra da Quantidade:** Se o usuário reportar ingestão de alimento SEM informar peso/porção, **não calcule**. Pergunte a quantidade exata primeiro.
* **Cálculo e Saldo:** Quando a quantidade for informada, extraia calorias e proteínas via *Structured Output*, atualize os acumulados em `registro_diario` no Supabase e responda com o saldo restante (`Meta do perfil - Consumido hoje`).


2. **Substituição de Treino:**
* **Regra das 3 Opções:** Ao receber um pedido para substituir um exercício da ficha cadastrada do usuário ativo (em `profiles.py`), a IA deve sugerir **exatamente 3 opções** com estrita equivalência biomecânica e cinesiológica.



---

## Estrutura do Repositório

```
├── main.py             # Handler do Telegram (Webhook/Polling e roteamento por ID)
├── profiles.py         # Configuração estática dos perfis Caio e Bel (prompts e treinos)
├── config.py           # Variáveis de ambiente
├── database.py         # Conexão enxuta com Supabase (vínculo de usuário e diário)
├── ai_engine.py        # Prompts do Soma, chamadas Gemini e Structured Output
├── requirements.txt    # Dependências (python-telegram-bot, google-genai, supabase)
└── vercel.json         # Configuração de deployment serverless

```

---

## Variáveis de Ambiente (`.env`)

```env
TELEGRAM_BOT_TOKEN="seu_token_telegram"
GEMINI_API_KEY="sua_chave_gemini_ai_studio"
SUPABASE_URL="[https://seu-projeto.supabase.co](https://seu-projeto.supabase.co)"
SUPABASE_KEY="sua_chave_anon_supabase"

```

---

## Comandos de Desenvolvimento

* **Instalar dependências:** `pip install -r requirements.txt`
* **Executar localmente:** `python main.py`
