'use client'
import React, { useState, useEffect } from "react";

export default function Fortnite() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
    const button = document.getElementById("myimage");
    button.style.left = `${Math.ceil(Math.random() * 90)}%`;
    button.style.top = `${Math.ceil(Math.random() * 90)}%`;
  };

  const doClick = () => {
    alert("Your Mom");
  };

  const resetClick = () => {
    const button = document.getElementById("myimage");
    const centerX = window.innerWidth / 2 - button.offsetWidth / 2;
    const centerY = window.innerHeight / 2 - button.offsetHeight / 2;
    button.style.left = `${centerX}px`;
    button.style.top = `${centerY}px`;
    setCount(0);
  };

  useEffect(() => {
    const button = document.getElementById("myimage");
    const centerX = window.innerWidth / 2 - button.offsetWidth / 2;
    const centerY = window.innerHeight / 2 - button.offsetHeight / 2;
    button.style.left = `${centerX}px`;
    button.style.top = `${centerY}px`;

    console.log(button);

    button?.addEventListener("mouseover", function () {
      button.style.left = `${Math.ceil(Math.random() * 90)}%`;
      button.style.top = `${Math.ceil(Math.random() * 90)}%`;
    });

    return () => {
      button.removeEventListener("mouseover", function () {
        button.style.left = `${Math.ceil(Math.random() * 90)}%`;
        button.style.top = `${Math.ceil(Math.random() * 90)}%`;
      });
    };
  }, []);

  return (
    <>
      <div className="body">
        <br></br>
        <h3>Fortnite???</h3>
      </div>
      <div className="centered">
        <div className="main">
          <div onClick={handleClick}>
            <input
              type="image"
              id="myimage"
              src="https://cdn-0001.qstv.on.epicgames.com/tFaisIxoSaCVPpPxIm/image/screen_comp.jpeg"
            />
          </div>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <button>Chat is this real: {count}</button>
          <br></br>
          <br></br>
          <button onClick={resetClick}>Reset Rot</button>
        </div>
      </div>
      <div onClick={doClick}>
        <input
          type="image"
          id="myimage2"
          src="https://tse1.mm.bing.net/th?id=OIP.rQH3xgraViebzkBRzSyfeQHaEK&pid=Api&P=0&h=220"
        ></input>
      </div>
          <div className="bounds">
            <img
              class="image"
              src="http://3.bp.blogspot.com/-CXed5bIgZ7M/U5iKD46rCfI/AAAAAAAAIzA/nMIOW4njjfo/s1600/holy-moly-smiley.png"
              alt=""
            ></img>
          </div>
    </>
  );
}