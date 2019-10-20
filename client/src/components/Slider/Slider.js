import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CardData = () => {
  const rtn = [
    {
      title: 'CARNATIONS',
      desc:
        "Carnations require well-drained, neutral to slightly alkaline soil, and full sun. Numerous cultivars have been selected for garden planting.[4] Typical examples include 'Gina Porto', 'Helen', 'Laced Romeo', and 'Red Rocket'.",
      url:
        'https://cdn.pixabay.com/photo/2017/07/24/02/40/pink-roses-2533389__340.jpg'
    },
    {
      title: 'STREET',
      desc:
        'A street is a public thoroughfare (usually paved) in a built environment.',
      url:
        'https://cdn.pixabay.com/photo/2017/08/01/20/06/storm-2567670__340.jpg'
    },
    {
      title: 'CAMERA',
      desc: 'Camera captures memories for you and saves them permanently.',
      url:
        'https://cdn.pixabay.com/photo/2017/08/07/01/41/magnifying-glass-2598507__340.jpg'
    },
    {
      title: 'BREAKFAST',
      desc: 'Breakfast provides many benefits to our health and wellbeing.',
      url:
        'https://images.pexels.com/photos/8524/food-spoon-milk-strawberry.jpg?h=350&auto=compress&cs=tinysrgb'
    }
  ];
  return rtn;
};

const Cards = props => {
  const cardData = CardData();
  return (
    <section>
      {cardData.map((card, i) => {
        return (
          <div className='card' id='card' style={props.cardStyle} key={i}>
            <p className='title'>{card.title}</p>
            <p className='desc'>{card.desc}</p>
            <a href='#'>
              <img src={card.url} />
            </a>
          </div>
        );
      })}
    </section>
  );
};

const Display = props => {
  const [currentCard, setCurrentCard] = useState(0);
  const [position, setPosition] = useState(0);
  const [cardStyle, setCardStyle] = useState({ transform: 'translateX(0px)' });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let boxWidth = document.getElementById('card').clientWidth;
    setWidth(boxWidth);
  }, []);

  // func: click the slider buttons
  const handleClick = type => {
    // get the card's margin-right
    let margin = window.getComputedStyle(document.getElementById('card'))
      .marginRight;
    margin = JSON.parse(margin.replace(/px/i, ''));

    const cardWidth = width; // the card's width
    const cardMargin = margin; // the card's margin
    const cardNumber = CardData().length; // the number of cards
    let currentCard_ = currentCard; // the index of the current card
    let position_ = position; // the position of the cards

    // slide cards
    if (type === 'next' && currentCard_ < cardNumber - 1) {
      currentCard_++;
      position_ -= cardWidth + cardMargin;
    } else if (type === 'prev' && currentCard_ > 0) {
      currentCard_--;
      position_ += cardWidth + cardMargin;
    }
    setCard(currentCard_, position_);
  };

  const setCard = (currentCard_, position_) => {
    setCurrentCard(currentCard_);
    setPosition(position_);
    setCardStyle({ transform: `translateX(${position_}px)` });
  };

  return (
    <Slider_Containder>
      <div className='cards-slider'>
        <div className='slider-btns'>
          <button
            className='slider-btn btn-l'
            onClick={() => handleClick('prev')}
          >
            &lt;
          </button>
          <button
            className='slider-btn btn-r'
            onClick={() => handleClick('next')}
          >
            &gt;
          </button>
        </div>
        <Cards cardStyle={cardStyle} />
      </div>
    </Slider_Containder>
  );
};

export default Display;

const Slider_Containder = styled.div`
  .cards-slider {
    overflow: hidden;
    white-space: nowrap;
    width: 500px;
    height: 100%;
    position: relative;
    display: inline-block;
    background: #e3e3e3;
    margin: 5px 0;
    border: 1px solid #d8d8d8;
    box-shadow: 1px 1px 10px #d8d8d8;
  }

  .card {
    float: left !important;
    text-align: left;
    background: #fff;
    width: 385px;
    max-width: 385px !important;
    position: relative;
    display: inline-block;
    left: 0;
    clear: both;
    margin-right: 5px;
    float: none !important;
    transition: transform 0.2s ease-in-out;
    vertical-align: top;
    padding: 20px 25px;
  }

  .card .title {
    font-weight: 600;
    font-size: 18px;
    border-bottom: 1px solid #d8d8d8;
  }

  .card .desc {
    font-size: 14px;
    word-wrap: break-word;
    white-space: -moz-pre-wrap;
    white-space: pre-wrap;
  }

  .card img {
    display: block;
    position: relative;
    width: 100%;
  }

  .slider-btn {
    padding: 0;
    font-size: 20px;
    text-align: center;
    color: #b3b3b3;
    width: 45px;
    height: 100%;
    border: 0;
    cursor: pointer;
    background: none;
    outline: none;
    position: absolute;
    z-index: 999;
    transition: all 0.6s ease 0s;
  }

  .slider-btn:hover {
    color: #5f5f5f;
    background: rgba(0, 0, 0, 0.2);
  }

  .btn-r {
    right: 0;
  }
  .btn-l {
    left: 0px;
  }
`;
