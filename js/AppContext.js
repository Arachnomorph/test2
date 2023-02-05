import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";

const AppContext = createContext(null);

function AppContextProvider({ children }) {
  const [cards, setCards] = useState([]);
  const storageKey = "cards";

  useEffect(() => {
    if (sessionStorage.getItem(storageKey) === null) {
      setCards([]);
    } else {
      setCards(JSON.parse(sessionStorage.getItem(storageKey)));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(cards));
  }, [cards]);

  const clearAll = useCallback(() => {
    setCards([]);
    sessionStorage.setItem(storageKey, JSON.stringify([]));
  }, [cards]);

  const handleCreateCard = useCallback(
    (val) => {
      if (!val) return;
      const card = {
        id: cards.length,
        description: val,
        discarded: true,
        stack: 1,
      };
      setCards((prev) => prev.concat(card));
    },
    [cards]
  );

  const isShuffled = useCallback(() => {
    return cards.some((el) => !el.discarded);
  }, [cards]);

  const handleShuffle = useCallback(() => {
    if (isShuffled) {
      setCards((prev) =>
        prev.map((card) => {
          if (card.discarded) {
            return { ...card, stack: 1, discarded: false };
          } else {
            return { ...card, stack: card.stack + 1, discarded: false };
          }
        })
      );
    } else {
      setCards((prev) => prev.map((card) => ({ ...card, discarded: false })));
    }
  }, [cards, isShuffled]);

  const handleDiscard = useCallback(
    (e) => {
      const id = parseInt(e.target.id);
      setCards((prev) =>
        prev.map((card) => {
          if (card.id !== id) {
            return { ...card };
          }
          return { ...card, discarded: true };
        })
      );
    },
    [cards]
  );

  const handleInfect = useCallback(
    (e) => {
      const id = parseInt(e.target.id);
      setCards((prev) =>
        prev.map((card) => {
          if (card.id !== id) {
            return { ...card };
          }
          return { ...card, discarded: false };
        })
      );
    },
    [cards]
  );

  const handleDestroy = useCallback(
    (e) => {
      const id = parseInt(e.target.id);
      setCards((prev) =>
        prev.map((card) => {
          if (card.id !== id) {
            return { ...card };
          }
          return { ...card, description: "DELETED" };
        })
      );
    },
    [cards]
  );

  const value = useMemo(() => {
    return {
      clearAll,
      cards,
      setCards,
      handleCreateCard,
      handleShuffle,
      handleDiscard,
      handleInfect,
      handleDestroy,
    };
  }, [cards, handleCreateCard()]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

AppContextProvider.propTypes = {
  children: PropTypes.any,
};

export { AppContextProvider };
export default AppContext;
