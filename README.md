# Jogo da Velha - Desafio Deal Group

Um jogo da velha moderno e interativo desenvolvido com React, apresentando funcionalidades avançadas como temporizador, sistema de pontuação, personalização de cores e cobertura de testes de 100%.

## 🚀 Comandos de Execução

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Visualizar build de produção
npm run preview
```

### Build

```bash
# Construir para produção
npm run build
```

### Testes

```bash
# Executar todos os testes
npm test

# Executar testes com interface visual
npm run test:ui

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage

# Gerar cobertura e abrir no navegador
npm run test:coverage:open

# Executar testes de cobertura em modo watch
npm run test:coverage:watch
```

### Qualidade de Código

```bash
# Verificar linting
npm run lint

# Corrigir problemas de linting
npm run lint:fix

# Formatar código
npm run format

# Verificar formatação
npm run format:check
```

## 🏆 Qualidade e Performance - 100%

### Cobertura de Testes

Este projeto alcançou **100% de cobertura de testes** em todas as métricas:

- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

Total de **1.245 testes** distribuídos em **29 arquivos de teste**, garantindo qualidade e confiabilidade do código.

### Lighthouse Report

O projeto também obteve **pontuação máxima no Lighthouse**:

- **Acessibilidade**: 100% - Totalmente acessível para usuários com deficiências
- **Melhores Práticas**: 100% - Seguindo os padrões modernos de desenvolvimento web

Demonstrando excelência tanto em qualidade de código quanto em experiência do usuário.

## 🎮 Regras do Jogo

### Como Jogar

1. **Objetivo**: Ser o primeiro a formar uma linha com 3 símbolos (horizontal, vertical ou diagonal)
2. **Jogadores**: X e O se alternam a cada jogada
3. **Temporizador**: Cada jogador tem 5 segundos para fazer sua jogada
4. **Vitória**: Quem conseguir 3 símbolos em linha vence
5. **Empate**: Se todas as casas forem preenchidas sem vencedor

### Sistema de Pontuação

- **Vitória**: +1 ponto para o vencedor
- **Empate**: Mantém a pontuação atual
- **Histórico**: Pontuação acumulada durante a sessão

### Funcionalidades Especiais

- **Timeout**: Se o tempo esgotar, a vez passa para o próximo jogador
- **Reset**: Reinicia o jogo mantendo a pontuação
- **Reset de Scores**: Zera toda a pontuação
- **Personalização**: Customização de cores em tempo real

## 🧩 Componentes e Funcionalidades

### Componentes de Jogo

- **GameBoard**: Tabuleiro principal 3x3 com detecção de cliques
- **Cell**: Célula individual do tabuleiro com estados visuais
- **CurrentPlayer**: Indicador do jogador atual
- **StatusMessage**: Mensagens de status do jogo (vitória, empate)

### Componentes de Interface

- **Timer**: Contador regressivo com barra de progresso visual
- **ScoreBoard**: Painel de pontuação dos jogadores
- **ScoreItem**: Item individual de pontuação
- **Controls**: Botões de controle (novo jogo, reset scores)
- **Header**: Cabeçalho da aplicação

### Componentes de Layout

- **ColorCustomizer**: Menu flutuante para personalização de cores
- **ColorSwatch**: Seletor de cores individual
- **ProgressBar**: Barra de progresso genérica
- **Button**: Botão customizável com variantes
- **Badge**: Elemento de badge para informações
- **Icon**: Sistema de ícones unificado
- **PlayerIndicator**: Indicador visual do jogador

## 🏗️ Arquitetura do Projeto

### Estrutura de Pastas

```
src/
├── components/           # Componentes React
│   ├── game/            # Componentes específicos do jogo
│   ├── ui/              # Componentes de interface reutilizáveis
│   └── layout/          # Componentes de layout
├── hooks/               # Hooks customizados
├── utils/               # Utilitários e lógica de negócio
├── styles/              # Estilos globais e temas
└── test/                # Configuração de testes
```

### Hooks Customizados

#### useGame

Hook principal que orquestra toda a funcionalidade do jogo, compondo outros hooks menores:

- **useGameState**: Gerencia estado do jogo (tabuleiro, jogador atual, status)
- **useGameScores**: Controla sistema de pontuação
- **useGameMoves**: Processa movimentos e validações

#### useTimer

Temporizador de alta precisão com:

- Atualização a cada 100ms para suavidade visual
- Controles de start, pause, restart
- Indicação de progresso percentual
- Detecção de expiração

#### useTheme

Sistema de temas dinâmico:

- Personalização de cores primárias e acentos
- Aplicação automática de variações de brilho
- Persistência de preferências

#### Hooks Utilitários

- **useToggle**: Gerencia estados booleanos
- **useClickOutside**: Detecta cliques fora de elementos
- **useFloatingActionButton**: Controla menu flutuante
- **useColorPalettes**: Gera paletas de cores harmoniosas

### Utilitários

#### gameLogic.js

Lógica pura do jogo:

- `checkWinner()`: Verifica condições de vitória ou empate
- `isValidMove()`: Valida se movimento é permitido
- `makeMove()`: Processa movimento no tabuleiro
- `getNextPlayer()`: Alterna entre jogadores

#### colorUtils.js

Manipulação de cores:

- Ajuste de brilho e saturação
- Conversões entre formatos
- Geração de paletas harmoniosas

#### constants.js

Configurações e constantes:

- Padrões de vitória (8 combinações possíveis)
- Estados do jogo
- Configurações padrão (timer: 5 segundos)

## 🎨 Sistema de Personalização

### Menu Flutuante de Cores

- **Ativação**: Botão flutuante no canto da tela
- **Cores Primárias**: Define cor principal da interface
- **Cores de Acento**: Define cor secundária/destaque
- **Aplicação Dinâmica**: Mudanças aplicadas em tempo real
- **Variações Automáticas**: Gera tons mais escuros automaticamente

### Responsividade

- Design mobile-first
- Adaptação automática para tablets e desktops
- Componentes flexíveis e escaláveis

## 🧪 Estratégia de Testes

### Estrutura de Testes

- **Testes Unitários**: Cada componente e hook testado isoladamente
- **Testes de Integração**: Interações entre componentes
- **Testes de Lógica**: Validação completa das regras de negócio

### Ferramentas

- **Vitest**: Framework de testes rápido e moderno
- **Testing Library**: Testes focados no comportamento do usuário
- **jsdom**: Ambiente de DOM para testes
- **Coverage V8**: Análise de cobertura nativa

### Qualidade Garantida

- Validação de props e estados
- Simulação de interações do usuário
- Testes de acessibilidade
- Cobertura de casos extremos

## 🛠️ Tecnologias Utilizadas

- **React 19**: Framework principal
- **Vite**: Build tool e servidor de desenvolvimento
- **Vitest**: Framework de testes
- **ESLint + Prettier**: Qualidade e formatação de código
- **CSS Modules**: Estilização modular
- **Lucide React**: Biblioteca de ícones

## 🚀 Deploy

O projeto está configurado para deploy em plataformas como:

- Vercel
- Netlify
- GitHub Pages

Basta conectar o repositório e a plataforma realizará o build automaticamente.

---

**Desenvolvido como parte do desafio técnico para Desenvolvedor Front-End Sênior**
