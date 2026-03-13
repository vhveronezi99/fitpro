# 💪 FitPro - Fitness Tracker App

Uma aplicação web moderna, bonita e intuitiva para rastrear seu progresso de treino, dieta e atividades aeróbicas.

## 🎯 Funcionalidades

### 🏠 Home Page (Dashboard)
- **Estatísticas em Tempo Real**: Visualize de forma resumida seus dados diários
  - Total de peso levantado
  - Número de exercícios realizados
  - Calorias ingeridas
  - Quilômetros de cardio
  
- **Gráficos Visuais**:
  - 📊 Progressão de Treino (Comparação semana anterior vs atual)
  - 📈 Evolução de Cardio (Gráfico de linha semanal)
  - ⚖️ Distribuição de Macros (Doughnut chart)

- **Resumo de Refeições**: Cards visuais com cada refeição do dia, mostrando:
  - Total de calorias por refeição
  - Quantidade de proteína
  - Divisão organizada por tipo de refeição

### 🏋️ Aba "TREINO"
#### Criar Rotinas
- Defina sua divisão de treino (AB, ABC, ABCDEF, PPL, Personalizada)
- Nomeie sua rotina para fácil identificação

#### Gerenciar Exercícios
Para cada exercício registre:
- Nome do exercício
- Peso utilizado (kg)
- Número de séries
- Número de repetições
- Data e hora são gravadas automaticamente

#### Progressão de Carga
- Visualize histórico de todos os exercícios
- Gráfico RADAR comparando última sessão vs melhor sessão
- Rastreamento automático de evolução de carga

#### Visual
- Cards coloridos e modernos para cada exercício
- Botões rápidos para deletar registros
- Histórico organizado por data

### 🥗 Aba "DIETA"
#### Cadastro de Alimentos
Para cada refeição e alimento registre:
- Nome do alimento/refeição
- Calorias
- Macros: Proteína, Carboidratos, Gorduras

#### Resumo Automático
- Soma automática de macros por refeição
- Soma automática de macros do dia completo
- Exibição em cards coloridos

#### Visualização
- Refeições agrupadas por tipo (Café da Manhã, Almoço, Jantar, etc)
- Gráfico Doughnut com distribuição de macros
- Cards com cores graduadas para fácil identificação

### 🏃 Aba "CARDIO"
#### Registrar Sessões
Para cada atividade aeróbica registre:
- Tipo (Corrida, Caminhada, Bicicleta, Natação, Elíptico)
- Tempo (em minutos)
- Distância (em quilômetros)
- Pace é calculado automaticamente

#### Estatísticas
- Tempo total de cardio do dia
- Distância total percorrida
- Pace médio calculado automaticamente

#### Histórico e Gráficos
- Tabela com todas as sessões do dia
- Gráfico de barras com evolução semanal
- Dados persistem automaticamente

## 🎨 Design e UX

### Características Visuais
- **Gradient Moderno**: Gradientes roxo/rosa na navegação e cards principais
- **Glass Morphism**: Efeito vidro nos cards para um look minimalista e sofisticado
- **Cards Responsivos**: Layout que se adapta a desktop e mobile
- **Ícones Font Awesome**: Ícones elegantes em toda a interface
- **Cores Harmoniosas**: Paleta de cores profissionais e agradável

### Responsividade
- Layout completamente responsivo
- Mobile-first approach
- Funciona perfeitamente em smartphones, tablets e desktops

## 💾 Armazenamento

Todos os dados são salvos automaticamente no **localStorage** do navegador:
- `fitpro_routines` - Rotinas de treino
- `fitpro_exercises` - Exercícios registrados
- `fitpro_meals` - Refeições e alimentos
- `fitpro_cardio` - Sessões de cardio

## 📊 Gráficos

Utilizamos **Chart.js** para visualizações profissionais:
- **Bar Chart**: Progressão de treino
- **Line Chart**: Evolução de cardio
- **Radar Chart**: Comparação de exercícios
- **Doughnut Chart**: Distribuição de macros

## 🚀 Como Usar

1. Abra o arquivo `index.html` em um navegador web
2. Dados de demonstração são carregados automaticamente
3. Use as diferentes abas para registrar suas atividades
4. Todos os dados são salvos automaticamente no navegador

## 📱 Estrutura do Projeto

```
site 2/
├── index.html       # HTML principal com toda a estrutura
├── app.js           # Lógica JavaScript com gerenciamento de dados
└── README.md        # Este arquivo
```

## 🔧 Tecnologias

- **HTML5** - Semântica e estrutura
- **CSS3** - Estilos e responsividade
- **JavaScript Vanilla** - Lógica e interatividade
- **Tailwind CSS** - Framework CSS via CDN
- **Chart.js** - Biblioteca de gráficos
- **Font Awesome** - Ícones
- **localStorage** - Persistência de dados

## 📈 Funcionalidades Futuras

- Sincronização com nuvem
- Exportação de dados (PDF, CSV)
- Integração com wearables
- Planos de treino personalizados
- Comunidade e desafios
- Notificações de lembretes
- Cálculo de IMC e índices de performance

## ✨ Dicas de Uso

- **Dashboard**: Confira seus dados consolidados ao abrir o app
- **Consistência**: Registre seus dados diariamente para melhor acompanhamento
- **Progressão**: Compare seus gráficos para visualizar evolução
- **Mobile**: Acesse pelo celular para registrar dados na hora

## 📄 Licença

Desenvolvido como uma aplicação de gerenciamento pessoal de fitness.

---

**Faça suas metas virarem realidade! 💪**
