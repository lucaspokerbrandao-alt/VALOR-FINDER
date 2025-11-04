import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- TRANSLATIONS ---

const translations = {
  pt: {
    header: {
      title: "Jogos de Futebol com Valor Esperado Positivo (EV+)",
      responsibleGaming: "Aviso de Jogo Responsável:",
      responsibleGamingText: "Aposte com moderação. Esta ferramenta é para fins educacionais e não garante lucros. Maiores de 18 anos.",
    },
    filters: {
      filterByDate: "Filtrar por Data",
      previousDay: "Dia anterior",
      nextDay: "Próximo dia",
      filterByLeague: "Filtrar por Liga",
      allLeagues: "Todas as Ligas",
      filterByTime: "Filtrar por Horário",
      allTimes: "Todos os Horários",
      morning: "Manhã (06:00 - 11:59)",
      afternoon: "Tarde (12:00 - 17:59)",
      night: "Noite (18:00 - 05:59)",
      minConfidence: "Confiança Mínima:",
      updating: "Atualizando...",
      refreshGames: "Atualizar Jogos",
    },
    matchCard: {
      odds: "Odds",
      realProb: "Prob. Real",
      impliedProb: "Prob. Implícita",
      confidence: "Confiança",
      viewOddsOn: "Ver Odd em {bookmakerName}",
      noMarketWithValue: "Nenhum mercado com valor encontrado.",
      analyzeWithGemini: "Analisar com Gemini",
      analyzeMatch: "Analisar Partida com Gemini",
    },
    matchList: {
      noGamesFound: "Nenhum jogo com valor encontrado",
      noGamesForFilters: "Nenhuma partida com EV+ foi identificada para os filtros selecionados. Tente atualizar ou verifique outro dia.",
    },
    loading: {
      analyzing: "Analisando dados e calculando EV...",
      pleaseWait: "Isso pode levar alguns segundos.",
    },
    disclaimer: {
      title: "Jogo Responsável é a Chave",
      text: "O Valor Finder é uma ferramenta de análise estatística e não uma casa de apostas ou um serviço de recomendação financeira. As informações aqui apresentadas são baseadas em modelos e não constituem garantia de resultados. O objetivo é puramente educacional, para demonstrar o conceito de Valor Esperado (EV). Apostas esportivas envolvem riscos significativos. Nunca aposte mais do que você pode perder. Se você acha que pode ter um problema com jogos, procure ajuda profissional.",
      copyright: "© {year} Valor Finder - Ferramenta de Estudo.",
    },
    analysisModal: {
      analysisOf: "Análise: {homeTeam} vs {awayTeam}",
      close: "Fechar modal",
      generating: "Gerando análise com Gemini...",
      loadError: "Não foi possível carregar a análise. Tente novamente.",
    },
    app: {
      fetchError: "Falha ao buscar os jogos. Ocorreu um erro desconhecido.",
      invalidResponse: "A API retornou uma resposta inválida.",
      invalidJson: "Ocorreu um erro ao processar os dados recebidos da API (JSON inválido)."
    },
  },
  en: {
    header: {
      title: "Football Matches with Positive Expected Value (EV+)",
      responsibleGaming: "Responsible Gaming Warning:",
      responsibleGamingText: "Bet moderately. This tool is for educational purposes and does not guarantee profits. For users 18+.",
    },
    filters: {
      filterByDate: "Filter by Date",
      previousDay: "Previous day",
      nextDay: "Next day",
      filterByLeague: "Filter by League",
      allLeagues: "All Leagues",
      filterByTime: "Filter by Time",
      allTimes: "All Times",
      morning: "Morning (06:00 - 11:59)",
      afternoon: "Afternoon (12:00 - 17:59)",
      night: "Night (18:00 - 05:59)",
      minConfidence: "Minimum Confidence:",
      updating: "Updating...",
      refreshGames: "Refresh Games",
    },
    matchCard: {
      odds: "Odds",
      realProb: "Real Prob.",
      impliedProb: "Implied Prob.",
      confidence: "Confidence",
      viewOddsOn: "View Odds on {bookmakerName}",
      noMarketWithValue: "No market with value found.",
      analyzeWithGemini: "Analyze with Gemini",
      analyzeMatch: "Analyze Match with Gemini",
    },
    matchList: {
      noGamesFound: "No valuable games found",
      noGamesForFilters: "No EV+ matches were identified for the selected filters. Try refreshing or check another day.",
    },
    loading: {
      analyzing: "Analyzing data and calculating EV...",
      pleaseWait: "This may take a few seconds.",
    },
    disclaimer: {
      title: "Responsible Gaming is Key",
      text: "Valor Finder is a statistical analysis tool, not a betting house or financial recommendation service. The information presented here is based on models and does not guarantee results. The purpose is purely educational, to demonstrate the concept of Expected Value (EV). Sports betting involves significant risks. Never bet more than you can afford to lose. If you think you may have a gambling problem, seek professional help.",
      copyright: "© {year} Valor Finder - A Study Tool.",
    },
    analysisModal: {
      analysisOf: "Analysis: {homeTeam} vs {awayTeam}",
      close: "Close modal",
      generating: "Generating analysis with Gemini...",
      loadError: "Could not load the analysis. Please try again.",
    },
    app: {
      fetchError: "Failed to fetch games. An unknown error occurred.",
      invalidResponse: "The API returned an invalid response.",
      invalidJson: "An error occurred while processing data from the API (invalid JSON)."
    },
  },
  es: {
    header: {
      title: "Partidos de Fútbol con Valor Esperado Positivo (EV+)",
      responsibleGaming: "Aviso de Juego Responsable:",
      responsibleGamingText: "Apueste con moderación. Esta herramienta es para fines educativos y no garantiza ganancias. Para mayores de 18 años.",
    },
    filters: {
      filterByDate: "Filtrar por Fecha",
      previousDay: "Día anterior",
      nextDay: "Día siguiente",
      filterByLeague: "Filtrar por Liga",
      allLeagues: "Todas las Ligas",
      filterByTime: "Filtrar por Hora",
      allTimes: "Todos los Horarios",
      morning: "Mañana (06:00 - 11:59)",
      afternoon: "Tarde (12:00 - 17:59)",
      night: "Noche (18:00 - 05:59)",
      minConfidence: "Confianza Mínima:",
      updating: "Actualizando...",
      refreshGames: "Actualizar Partidos",
    },
    matchCard: {
      odds: "Cuotas",
      realProb: "Prob. Real",
      impliedProb: "Prob. Implícita",
      confidence: "Confianza",
      viewOddsOn: "Ver Cuota en {bookmakerName}",
      noMarketWithValue: "No se encontró ningún mercado con valor.",
      analyzeWithGemini: "Analizar con Gemini",
      analyzeMatch: "Analizar Partido con Gemini",
    },
    matchList: {
      noGamesFound: "No se encontraron partidos con valor",
      noGamesForFilters: "No se identificaron partidos con EV+ para los filtros seleccionados. Intente actualizar o verifique otro día.",
    },
    loading: {
      analyzing: "Analizando datos y calculando EV...",
      pleaseWait: "Esto puede tardar unos segundos.",
    },
    disclaimer: {
      title: "El Juego Responsable es la Clave",
      text: "Valor Finder es una herramienta de análisis estadístico y no una casa de apuestas o un servicio de recomendación financiera. La información aquí presentada se basa en modelos y no constituye garantía de resultados. El objetivo es puramente educativo, para demostrar el concepto de Valor Esperado (EV). Las apuestas deportivas implican riesgos significativos. Nunca apueste más de lo que puede permitirse perder. Si cree que puede tener un problema con el juego, busque ayuda profesional.",
      copyright: "© {year} Valor Finder - Herramienta de Estudio.",
    },
    analysisModal: {
      analysisOf: "Análisis: {homeTeam} vs {awayTeam}",
      close: "Cerrar modal",
      generating: "Generando análisis con Gemini...",
      loadError: "No se pudo cargar el análisis. Por favor, inténtelo de nuevo.",
    },
    app: {
      fetchError: "Error al buscar los partidos. Ocurrió un error desconocido.",
      invalidResponse: "La API devolvió una respuesta no válida.",
      invalidJson: "Ocurrió un error al procesar los datos recibidos de la API (JSON inválido)."
    },
  },
};

type Language = keyof typeof translations;

interface I18nContextType {
  language: Language;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const getInitialLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0] as Language;
  return translations[browserLang] ? browserLang : 'pt';
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language] = useState<Language>(getInitialLanguage);

  const t = (key: string, replacements?: { [key: string]: string | number }): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        return key; // Return key if not found
      }
    }
    
    let text = String(result);

    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        text = text.replace(`{${placeholder}}`, String(replacements[placeholder]));
      });
    }

    return text;
  };

  return (
    <I18nContext.Provider value={{ language, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};