import styled from 'styled-components'
import { Link } from 'react-router-dom';

export const HeaderWrapper = styled.header`

width: 100%;
position: sticky;
top: 0;
background-color:#2D3A3A ;
display: flex;
align-items: center;
justify-content: space-between;
padding: 15px;

`



export const ListWrapper = styled.ul`
display: flex;
align-items: center;
justify-content: center;
gap: 10px;
width: 100%;
flex-direction: row;
`

export const SectionWrapper = styled.section`
    width: 100%;
    padding: 20px;
    display: flex;
align-items: center;
justify-content: space-between;
gap: 10px;
`

export const Titre1 = styled.h1`
    font-size: 35px;
    text-align: center;
    margin: 10px;
`

export const Button = styled.button`
    padding: 20px;
    cursor: pointer;
    font-size: 20px;
    font-weight:500px;
    transition: all .3s;
    background-color:#102E4A ;
    color: #fff;
    border-radius:20px;
    border: none; 
    outline:none;

    &:hover{
        background-color:#040F0F ;
    }
`

export const Box = styled.div`
    width: fit-content;
    min-width: 500px;
    padding: 10px;
    display: flex;
align-items: center;
justify-content: space-between;
gap: 10px;
flex-direction: column;
`
export const Box2 = styled.div`
    width: 100%;
   
    padding: 10px;
    display: flex;
align-items: center;
justify-content: space-evenly;
gap: 20px;
`
export const Para = styled.p`
font-size: 20px;
font-weight: 450;
text-align: center;
width: 700px;

`



//page main color : #0D1F2D
//header color : #040F0F
//side bar color : #2D3A3A
//juste comme ça : #102E4A
