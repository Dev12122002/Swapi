import React from "react";
import styled from "styled-components";
import { useRef, useEffect, useState } from 'react';
import DetailsModel from "./DetailsModel";

const CharacterContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  width: 330px;
  box-shadow: 0 3px 10px 0 #aaa;
  cursor: pointer;
  max-height: 400px;
  // border: 2px solid black;
  // background: white;

  &:hover {
    box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.3); /* Change box shadow on hover */
    transform: scale(1.05);
    transition: all 0.3s ease;
  }
`;
const CoverImage = styled.img`
  object-fit: contains;
  height: 250px;
`;
const CharachterName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: black;
  // margin: 15px 0;
  margin-left: auto;
  margin-right: auto;
  // margon-top: 25px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

function isValidCSSColor(colorName) {
  // Create a dummy element
  const dummyElement = document.createElement('div');
  // Apply the color to the dummy element
  dummyElement.style.color = colorName;
  // Check if the computed color is different from the initial value
  // If it is, it means the browser recognized the color
  return dummyElement.style.color !== '';
}

const CharacterCard = (props) => {
  const { name, image } = props.Character;
  const [showModel, setShowModel] = useState(false);
  const infoRef = useRef(null);

  // eslint-disable-next-line
  const [isOverflowing, setIsOverflowing] = useState(false);

  const handleImageError = (event) => {
    event.target.src = "/images/logo.png"; // Set the source of the image to the default image
  };


  useEffect(() => {

    const checkOverflow = () => {
      if (infoRef.current) {
        setIsOverflowing(infoRef.current.scrollHeight > infoRef.current.clientHeight);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);
  return (
    <>
      <DetailsModel key={props.Character.created.replace(/\D/g, '')} unique={props.Character.created.replace(/\D/g, '')} showModel={showModel} setShowModel={setShowModel} data={props.Character} />
      <CharacterContainer
        style={{ background: isValidCSSColor(props.Character.skin_color) ? props.Character.skin_color : "#e0d7d7" }}
        onClick={() => {
          setShowModel(true);
        }}
      >
        <CoverImage src={image + ""} alt={name} onError={handleImageError} />
        <CharachterName className="mt-2">{name}</CharachterName>
      </CharacterContainer>

    </>
  );
};
export default CharacterCard;