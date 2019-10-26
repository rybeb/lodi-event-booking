import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';

const EventSlider = props => {
  const [currentCard, setCurrentCard] = useState(0);
  const [position, setPosition] = useState(0);
  const [cardStyle, setCardStyle] = useState({ transform: 'translateX(0px)' });
  const [width, setWidth] = useState(0);

  const getWidth = () => {
    const boxWidth = document.getElementById('card1').clientWidth;
    setWidth(boxWidth);
  };

  let resizeId;

  window.addEventListener('resize', e => {
    e.preventDefault();
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 500);
  });

  const doneResizing = () => {
    if (props.events.length !== 0) {
      getWidth();
      setCard(0, 0);
    }
  };

  const setCard = (currentCard_, position_) => {
    setCurrentCard(currentCard_);
    setPosition(position_);
    setCardStyle({ transform: `translateX(${position_}px)` });
  };

  const handleClick = type => {
    let margin = window.getComputedStyle(document.getElementById('card1'))
      .marginRight;
    margin = JSON.parse(margin.replace(/px/i, ''));

    const cardWidth = width;
    const cardMargin = margin;
    const cardNumber = props.events.length;
    let currentCard_ = currentCard;
    let position_ = position;

    if (type === 'next' && currentCard_ < cardNumber - 1) {
      currentCard_++;
      position_ -= cardWidth + cardMargin;
    } else if (type === 'prev' && currentCard_ > 0) {
      currentCard_--;
      position_ += cardWidth + cardMargin;
    }

    setCard(currentCard_, position_);
  };

  useEffect(() => {
    if (props.events.length !== 0) getWidth();
  }, []);

  return (
    <Slider_Containder className='mt-2'>
      <div className='cards-slider'>
        <div className=''>
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
        <div className='card'>
          <h5 className='card-header'>{props.header}</h5>
          <div className='card-body'>
            {props.events.map((event, i) => {
              return (
                <div className='card1' id='card1' style={cardStyle} key={i}>
                  {event}
                </div>
              );
            })}
            {props.events.length === 0 && (
              <p>You don't have any events coming up.</p>
            )}
          </div>
        </div>
      </div>
    </Slider_Containder>
  );
};

export default EventSlider;

const Slider_Containder = styled.div`
  .cards-slider {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    height: 100%;
    position: relative;
    display: inline-block;
    background: #e3e3e3;
    margin: 5px 0;
    border: 1px solid #d8d8d8;
    box-shadow: 1px 1px 10px #d8d8d8;
  }

  .card1 {
    float: left !important;
    text-align: left;
    width: 33%;
    max-width: 350px;
    position: relative;
    display: inline-block;
    left: 0;
    clear: both;
    margin-right: 5px;
    float: none !important;
    transition: transform 0.2s ease-in-out;
    vertical-align: top;
  }

  @media only screen and (max-width: 800px) {
    .card1 {
      width: 50%;
      max-width: 50% !important;
    }
  }

  @media only screen and (max-width: 550px) {
    .card1 {
      width: 90%;
      max-width: 90% !important;
    }
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
