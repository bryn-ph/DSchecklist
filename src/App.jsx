import { useState, useEffect } from "react";
import "./App.css";
import ds1Logo from "./assets/ds1.png";
import ds2Logo from "./assets/ds2.png";
import ds3Logo from "./assets/ds3.png";

const bosses = {
  "Dark Souls 1": [
    "Asylum Demon",
    "Taurus Demon",
    "Bell Gargoyles",
    "Moonlight Butterfly",
    "Capra Demon",
    "Gaping Dragon",
    "Chaos Witch Quelaag",
    "Iron Golem",
    "Stray Demon",
    "Ornstein and Smough",
    "Crossbreed Priscilla",
    "Dark Sun Gwyndolin",
    "Great Grey Wolf Sif",
    "Four Kings",
    "Demon Firesage",
    "Centipede Demon",
    "Bed of Chaos",
    "Seath the Scaleless",
    "Gravelord Nito",
    "Sanctuary Guardian",
    "Knight Artorias",
    "Black Dragon Kalameet",
    "Manus, Father of the Abyss",
    "Gwyn, Lord of Cinder",
  ],
  "Dark Souls 2": [
    "The Last Giant",
    "The Pursuer",
    "Dragonrider",
    "Old Dragonslayer",
    "Flexile Sentry",
    "Ruins Sentinel",
    "Belfry Gargoyles",
    "Lost Sinner",
    "Executioner's Chariot",
    "Skeleton Lords",
    "Covetous Demon",
    "Mytha, the Baneful Queen",
    "Smelter Demon",
    "Old Iron King",
    "Scorpioness Najka",
    "Royal Rat Vanguard",
    "The Rotten",
    "Royal Rat Authority",
    "Prowling Magus and Congregation",
    "The Duke's Dear Freja",
    "Twin Dragonriders",
    "Looking Glass Knight",
    "Demon of Song",
    "Velstadt, the Royal Aegis",
    "Guardian Dragon",
    "Giant Lord",
    "Ancient Dragon",
    "Throne Watcher and Defender",
    "Nashandra",
    "Elana, the Squalid Queen",
    "Sinh, the Slumbering Dragon",
    "Graverobber, Varg, and Cerah",
    "The Fume Knight",
    "Sir Alonne",
    "Blue Smelter Demon",
    "Aava, the King's Pet",
    "White Covetous Demon",
    "Lud, the King's Pet and Zallen, the King's Pet",
    "Burnt Ivory King",
    "Aldia, Scholar of the First Sin"
  ],
  "Dark Souls 3": [
    "Iudex Gundyr",
    "Vordt of the Boreal Valley",
    "Curse-rotted Greatwood",
    "Crystal Sage",
    "Abyss Watchers",
    "Deacons of the Deep",
    "High Lord Wolnir",
    "Old Demon King",
    "Pontiff Sulyvahn",
    "Aldrich, Devourer of Gods",
    "Yhorm the Giant",
    "Dancer of the Boreal Valley",
    "Oceiros, the Consumed King",
    "Champion Gundyr",
    "Dragonslayer Armour",
    "Lorian and Lothric",
    "Ancient Wyvern",
    "Nameless King",
    "Soul of Cinder",
    "Champion's Gravetender and Gravetender Greatwolf",
    "Sister Friede",
    "Demon in Pain & Demon from Below",
    "Halflight, Spear of the Church",
    "Darkeater Midir",
    "Slave Knight Gael"
  ],
};

const gameLogos = {
  "Dark Souls 1": ds1Logo,
  "Dark Souls 2": ds2Logo,
  "Dark Souls 3": ds3Logo,
};

function App() {
  const [skipCount, setSkipCount] = useState(0);
  const [states, setStates] = useState({
    "Dark Souls 1": {},
    "Dark Souls 2": {},
    "Dark Souls 3": {},
  });

  // Load states and skip count from localStorage
  useEffect(() => {
    const savedStates = JSON.parse(localStorage.getItem("bossStates")) || {
      "Dark Souls 1": {},
      "Dark Souls 2": {},
      "Dark Souls 3": {},
    };
    setStates(savedStates);

    const savedSkipCount = Object.values(savedStates).reduce(
      (acc, gameState) => {
        return (
          acc + Object.values(gameState).filter((boss) => boss.skip).length
        );
      },
      0
    );
    setSkipCount(savedSkipCount);
  }, []);

  const handleSkipChange = (game, boss) => {
    const newStates = { ...states };
    const currentSkipStatus = !!newStates[game][boss]?.skip;

    if (currentSkipStatus) {
      newStates[game][boss].skip = false;
      setSkipCount(skipCount - 1);
    } else if (skipCount < 3) {
      newStates[game][boss] = {
        ...newStates[game][boss],
        skip: true,
        defeated: false,
      };
      setSkipCount(skipCount + 1);
    }
    setStates(newStates);
    localStorage.setItem("bossStates", JSON.stringify(newStates));
    localStorage.setItem(
      "skipCount",
      JSON.stringify(skipCount + (currentSkipStatus ? -1 : 1))
    );
  };

  const handleDefeatChange = (game, boss) => {
    const newStates = { ...states };
    const currentDefeatStatus = !!newStates[game][boss]?.defeated;

    newStates[game][boss] = {
      ...newStates[game][boss],
      defeated: !currentDefeatStatus,
      skip: false,
    };
    if (newStates[game][boss].skip) {
      setSkipCount(skipCount - 1);
    }
    setStates(newStates);
    localStorage.setItem("bossStates", JSON.stringify(newStates));
    if (newStates[game][boss].skip) {
      localStorage.setItem("skipCount", JSON.stringify(skipCount - 1));
    }
  };

  return (
    <>
      <div className="title">
        <h1>Soulsborne Checklist</h1>
        <h5 className="subtitle">For the boys....</h5>
        <h3 className="skipCounter">Skips Left: {3 - skipCount}</h3>
      </div>
      <div className="content">
        {Object.keys(bosses).map((game) => (
          <div key={game} className="checklist">
            <img
              src={gameLogos[game]}
              alt={`${game} logo`}
              className="game-logo"
            />
            {bosses[game].map((boss) => (
              <div key={boss} className="boss">
                <span>{boss}</span>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox-custom defeated"
                    checked={!!states[game][boss]?.defeated}
                    onChange={() => handleDefeatChange(game, boss)}
                    disabled={!!states[game][boss]?.skip}
                  />
                  Defeated
                </label>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox-custom skip"
                    checked={!!states[game][boss]?.skip}
                    onChange={() => handleSkipChange(game, boss)}
                    disabled={
                      !!states[game][boss]?.defeated ||
                      (skipCount >= 3 && !states[game][boss]?.skip)
                    }
                  />
                  Skip
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
