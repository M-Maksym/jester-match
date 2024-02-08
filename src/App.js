import { useEffect, useRef, useState } from 'react';
import './App.css';
import SingleCard from './Components/SingleCard/SingleCard';
import Confetti from 'react-confetti';

const setOfPlayingCard = [
  {'src': '/img/y-joker.png', matched: false},
  {'src': '/img/b-joker.png', matched: false},
  {'src': '/img/clubs-king.png', matched: false},
  {'src': '/img/hearts-king.png', matched: false},
  {'src': '/img/spades-king.png', matched: false},
  {'src': '/img/diamonds-king.png', matched: false}
]

function App() {
  const [PlayingCard, setPlayingCard] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceFirst, setChoiceFirst] = useState(null);
  const [choiceSecond, setChoiceSecond] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const joke = useRef('');
  const url = 'https://icanhazdadjoke.com/';

  //shuffle
  const shuffledPlayingCard = () => {
    const shuffledPlayingCard = [...setOfPlayingCard, ...setOfPlayingCard]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({...card, id: Math.random()}));
    setChoiceFirst(null);
    setChoiceSecond(null);
    setPlayingCard(shuffledPlayingCard);
    setTurns(0);
        //fetching joke
        fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          }
        })
        .then(response => response.json())
        .then(json => {
          joke.current = json;
        });
  };

  //player`s choice
  const handleChoice = (card) => {
    choiceFirst ? setChoiceSecond(card) : setChoiceFirst(card);
  };

  //compare 2 selected playing card
  useEffect(() => {
    if(choiceFirst && choiceSecond){
      setDisabled(true);
      if(choiceFirst.src === choiceSecond.src){
        setPlayingCard(prevPlayingCard => {
          return prevPlayingCard.map(card => {
            if(card.src === choiceFirst.src){
              return {...card, matched: true };
            }else{
              return card;
            }
          })
        })
        resetTurn();
      }else{
        setTimeout(()=>{
          resetTurn();
        }, 1000) 
      }
    }
    let progress = PlayingCard.every((obj)=>obj.matched === true);
    setEndGame(progress);
  }, [choiceFirst, choiceSecond, PlayingCard]);

  //reset choices
  const resetTurn = () => {
    setChoiceFirst(null);
    setChoiceSecond(null);
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false);
  };

  useEffect(()=>{
    //Auto start
    shuffledPlayingCard();
    setEndGame(false);

    //fetching joke
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => {
      joke.current = json;
    });
  }, []);

  //return
  if(endGame){
    return(
      <div className="App">
       <Confetti

    />
      <img src='/img/jester1.png' className='logo' alt='jester'/>
      <h1 className='name'>Jester Match</h1>
      <button onClick={shuffledPlayingCard}>Retry</ button>
      <h2>
          Congratulation
      </h2>
      <h3>You won with {turns} turns, so the joke's on me</h3>
      <p>{joke.current.joke}</p>
    </div>
    )
  } else{
  return ( 
    <div className="App">
      <img src='/img/jester1.png' className='logo' alt='jester'/>
      <h1 className='name'>Jester Match</h1>
      <p className='promise'>Win and get a joke</p>
      <button onClick={shuffledPlayingCard}>Retry</ button>
      <div className='card-grid'>
        {PlayingCard.map(card => (
          <SingleCard 
            key={card.id} 
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceFirst || card === choiceSecond || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
}

export default App;
