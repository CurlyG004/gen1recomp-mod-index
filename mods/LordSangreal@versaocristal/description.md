# Versao Cristal

**Pokemon Crystal em portugues brasileiro.** Tradução própria, escrita diretamente a partir do inglês original de cada fala da ROM de Crystal.

Roda em dois motores a partir do mesmo pacote: `gen1recomp` e [Gen2Recomped](https://github.com/UNDERdecoded/Gen2Recomped), com suporte completo a PC e Android.

Nao acompanha nenhum byte de ROM. **Todo o texto e traducao propria, escrita do zero a partir do ingles da ROM de Crystal** -- nao ha uma linha derivada de outra traducao no pacote.

## Cobertura e Compatibilidade

| Categoria | Estado |
|---|---|
| Falas e diálogos de NPC | 11.519 entradas com registro duplo (ponteiros de ROM e rótulos) |
| Menus e batalha | 1.095 chaves sincronizadas |
| Pontos de referência no mapa (`landmarks.lua`) | 94 locais de Johto e Kanto formatados em 11 colunas ou menos |
| Descrições de golpe | 251 descrições completas |
| Descrições de item | 161 descrições completas |
| Glifos acentuados desenhados | 25 caracteres em página própria de fonte |

O mod conta com **registro duplo de ponteiros**: o motor `gen1recomp` busca as falas por ponteiro de banco (`banco:endereco`), enquanto o `Gen2Recomped` indexa por rótulo (`TEXT_S...` / rótulo nomeado). O pacote registra ambos simultaneamente, garantindo compatibilidade transparente em qualquer um dos dois ambientes.

## O que você pode escolher

No menu **MODS -> Versao Cristal -> OPTIONS**, é possível personalizar independentemente:

- **FALAS:** PORTUGUÊS / ENGLISH
- **MENUS E BATALHA:** PORTUGUÊS / ENGLISH
- **DESCRIÇÕES DE GOLPES:** PORTUGUÊS / ENGLISH
- **DESCRIÇÕES DE ITENS:** PORTUGUÊS / ENGLISH

O padrão é 100% em português, e a alteração tem efeito no próximo boot do jogo.

## O que fica no original, de propósito

- **Nomes de POKéMON** (BULBASAUR, SUICUNE, CELEBI), **nomes de personagens** (EUSINE, CLAIR, PROF. ELM) e siglas **TM/HM** permanecem no original para preservar a comunicação universal e o padrão oficial da franquia.
- **Nomes de golpes e itens** permanecem no padrão da franquia, com todas as descrições explicativas traduzidas em português brasileiro (com base no TCG oficial).
- **Cidade, Rota e Vila traduzem a palavra genérica**, preservando o nome próprio ("VIOLET CITY" -> "CIDADE DE VIOLET", "ROUTE 30" -> "ROTA 30").
- **A interface do launcher e gerenciador de mods** permanece em inglês devido ao tamanho fixo dos botões do aplicativo.

## Acentuação

O mod acrescenta uma **página própria de 25 glifos acentuados** (`assets/font/latin.png`) acima das páginas da ROM, sem sobrescrever caracteres existentes. Cada caractere acentuado ocupa exatamente uma coluna de texto.

## Joga Gold ou Silver?

A tradução para Pokémon Gold e Silver está disponível no mod [Versao Dourada](https://github.com/LordSangreal/versaodourada).
