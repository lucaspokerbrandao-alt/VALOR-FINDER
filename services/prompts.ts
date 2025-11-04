import { Match } from '../types';

export type Language = 'pt' | 'en' | 'es';

export const getFetchMatchesPrompt = (lang: Language, date: string): string => {
  const commonInstructions = `
    Retorne os dados EXCLUSIVAMENTE como uma string de array JSON, sem formatação markdown ou texto explicativo. O JSON deve seguir esta estrutura:
    [
      {
        "homeTeam": "string",
        "awayTeam": "string",
        "league": "string",
        "matchTime": "string (ISO 8601 UTC)",
        "location": "string (Stadium, City)",
        "markets": [
          {
            "market": "string",
            "realProbability": "number (0-1)",
            "bookmakerOdds": "number",
            "bookmakerName": "string",
            "bookmakerUrl": "string (URL)",
            "confidenceScore": "integer (0-100)"
          }
        ]
      }
    ]
  `;

  const prompts = {
    pt: `
      Aja como um analista de dados esportivos especialista em futebol.
      Sua tarefa é usar a busca (Google Search) para encontrar informações atualizadas e fornecer uma lista de até 15 jogos de futebol REAIS que acontecerão no dia ${date}. Priorize jogos que ainda não começaram e de ligas conhecidas.

      Para cada jogo encontrado, siga estes passos:
      1. Use a busca para obter informações precisas e atualizadas sobre os times, liga, horário (ISO 8601 UTC), local (estádio, cidade) e estatísticas.
      2. Analise o jogo e identifique até 3 mercados de aposta diferentes com valor (EV+), incluindo mercados de gols no primeiro tempo (HT).
      3. Para CADA mercado com valor, forneça: 'market', 'realProbability' (0-1), 'bookmakerOdds', 'bookmakerName', 'bookmakerUrl' (link direto ou busca no Google), e 'confidenceScore' (0-100).

      O objetivo é encontrar múltiplos mercados com EV+ para um mesmo jogo, se eles existirem. Se não encontrar nenhum, não inclua o jogo.
      ${commonInstructions}
    `,
    en: `
      Act as an expert sports data analyst specializing in football.
      Your task is to use Google Search to find up-to-date information and provide a list of up to 15 REAL football matches happening on ${date}. Prioritize matches that have not yet started and are from well-known leagues.

      For each match found, follow these steps:
      1. Use the search to get accurate and updated information about the teams, league, time (ISO 8601 UTC), location (stadium, city), and statistics.
      2. Analyze the match and identify up to 3 different betting markets with value (EV+), including first-half (HT) goal markets.
      3. For EACH valuable market, provide: 'market', 'realProbability' (0-1), 'bookmakerOdds', 'bookmakerName', 'bookmakerUrl' (direct link or Google search), and 'confidenceScore' (0-100).

      The goal is to find multiple EV+ markets for the same match if they exist. If you find none, do not include the match.
      ${commonInstructions}
    `,
    es: `
      Actúa como un analista de datos deportivos experto en fútbol.
      Tu tarea es usar la búsqueda (Google Search) para encontrar información actualizada y proporcionar una lista de hasta 15 partidos de fútbol REALES que ocurrirán el ${date}. Prioriza partidos que aún no han comenzado y de ligas conocidas.

      Para cada partido encontrado, sigue estos pasos:
      1. Usa la búsqueda para obtener información precisa y actualizada sobre los equipos, liga, horario (ISO 8601 UTC), ubicación (estadio, ciudad) y estadísticas.
      2. Analiza el partido e identifica hasta 3 mercados de apuestas diferentes con valor (EV+), incluyendo mercados de goles en la primera mitad (HT).
      3. Para CADA mercado con valor, proporciona: 'market', 'realProbability' (0-1), 'bookmakerOdds', 'bookmakerName', 'bookmakerUrl' (enlace directo o búsqueda en Google), y 'confidenceScore' (0-100).

      El objetivo es encontrar múltiples mercados con EV+ para un mismo partido si existen. Si no encuentras ninguno, no incluyas el partido.
      ${commonInstructions}
    `,
  };

  return prompts[lang];
};

export const getAnalysisPrompt = (lang: Language, match: Match): string => {
  const prompts = {
    pt: `
      Forneça uma análise detalhada para a partida de futebol entre ${match.homeTeam} e ${match.awayTeam} na ${match.league}.

      Foco da análise:
      - Forma recente de ambas as equipes (últimos 5 jogos).
      - Estatísticas chave de ataque e defesa (gols marcados/sofridos, xG).
      - Jogadores chave (artilheiros, desfalques importantes).
      - Histórico de confrontos diretos (H2H).
      - Breve resumo tático de como o jogo pode se desenrolar.

      Conclua com um "Veredito da Análise", resumindo os pontos importantes.
      Use tom informativo e formatação markdown.
    `,
    en: `
      Provide a detailed analysis for the football match between ${match.homeTeam} and ${match.awayTeam} in the ${match.league}.

      Focus of the analysis:
      - Recent form of both teams (last 5 games).
      - Key offensive and defensive stats (goals scored/conceded, xG).
      - Key players (top scorers, important absences).
      - Head-to-head history (H2H).
      - Brief tactical summary of how the game might unfold.

      Conclude with an "Analysis Verdict", summarizing the key points.
      Use an informative tone and markdown formatting.
    `,
    es: `
      Proporcione un análisis detallado para el partido de fútbol entre ${match.homeTeam} y ${match.awayTeam} en la ${match.league}.

      Foco del análisis:
      - Forma reciente de ambos equipos (últimos 5 partidos).
      - Estadísticas clave de ataque y defensa (goles marcados/recibidos, xG).
      - Jugadores clave (máximos goleadores, ausencias importantes).
      - Historial de enfrentamientos directos (H2H).
      - Breve resumen tàctico de cómo podría desarrollarse el partido.

      Concluya con un "Veredicto del Análisis", resumiendo los puntos importantes.
      Use un tono informativo y formato markdown.
    `,
  };

  return prompts[lang];
};
