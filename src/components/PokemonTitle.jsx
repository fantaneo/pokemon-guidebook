import React from "react";
import styled from "styled-components";

const TitleWrapper = styled.h1`
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-weight: 800;
  font-size: 3.5rem;
  /* color: #3d7dca; // ポケモンの青 */
  /* text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2); */
  letter-spacing: 2px;
  text-align: center;
  margin: 20px 0;
  background: linear-gradient(
    45deg,
    #f1d151,
    #f3d4ac
  ); // 黄色からオレンジへのグラデーション
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PokemonTitle = () => {
  return <TitleWrapper>ポケモン図鑑</TitleWrapper>;
};

export default PokemonTitle;
