import styled from "styled-components";

export const Sidebar = styled.div`
height: 100%;
width: 100%;
background-color:#222 ;
padding-top: 20px;
gap: 5px;
padding: 10px;
border-radius: 20px;
box-shadow: 0 0 2px #000;
position: sticky;
top: 0;


img{
    max-width: 40px;
}
`

export const MainWrapper = styled.section`
width: 100%;
height: 100vh;
padding-right: 5px;

background-color: #ccc;

`
export const MainWrapper_admin = styled.section`
width: 100%;
height: 100vh;
padding-right: 5px;
display: flex;
align-items: center;
justify-content: center;
background-color: #ccc;

`

export const ContentWrapper = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    width: 'calc(100% - 250px)', // Adjust width based on sidebar width
    marginLeft: '250px', // Match sidebar width
  });

export const Box_container = styled.div`
    width: 100%;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    
    gap: 20px;


    ul li{
        list-style: none;
font-size: 13px;
    }

`


export const ModalContainer = styled.div`
   width: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
   height: 100%;
   position: absolute;
   top: 0;
   left: 0;
   height: 100%;
   z-index: 100;
   
`
export const Overlay = styled.div`
   width: 100%;
   background-color: #000;
   opacity: 0.6;
   position: absolute;
   top: 0;
   left: 0;
   height: 100%;
   
`

export const Box = styled.div`
width: 240px;
border-radius: 30px;
cursor: pointer;
padding: 20px;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
gap: 5px;
text-align: center;
transition: all .3s;

img{
    max-width: 90px;
}

h2{
    font-size: 23px;
    color: #fff;
    
}

&:hover{
    outline: 2px solid deepskyblue;
    background-color: #333;
}
`
export const Box2 = styled.div`
width: 100%;
margin: 0 10px;
border-radius: 30px;
cursor: pointer;
padding: 20px;
display: flex;
align-items: center;
justify-content: center;

gap: 10px;
text-align: center;
outline: 2px solid deepskyblue;
    background-color: #333;


img{
    max-width: 70px;
}

h2{
    font-size: 23px;
    color: #fff;
    
}

`


export const Box3 = styled.div`
    width: 290px;
border-radius: 30px;
cursor: pointer;
padding: 10px;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
gap: 3px;
text-align: center;
color: #000;


img{
    max-width: 70px;
}
`



export const ModalWrapper = styled.div`
    width: 700px;
    border-radius: 20px;
    z-index: 100;
    box-shadow: 0 0 3px #fff;
    background-color: #fff;
    display: flex;
   align-items: center;
   justify-content: center;
   flex-wrap: wrap;
   gap: 20px;
   padding: 15px;

`

export const Back_button = styled.button`

padding: 10px;
font-size: 20px;
font-weight: 500;
cursor: pointer;
border-radius: 15px;
background-color: #fff;
transition: all .3s;
position: absolute;
box-shadow: 0 0 3px #000;
top:3%;
left: 1%;
border: 1px solid #ccc;
outline: none;
display: flex;
   align-items: center;
   justify-content: center;


&:hover{
    background-color: #b5b3b3;
}
`


export const Textfield_styled = styled.input`
    width: 100%;
    padding: 10px;
    font-size: 20px;
    color: #fff;
    border: 2px solid #ccc;
    outline: none;
    border-radius: 9px;
    background-color: transparent;
    transition: all .3s;
    margin-top: 20px;
    margin-bottom: 20px;


    &:focus{
        border-color: deepskyblue;
        box-shadow: 0 0 5px  #fff;
    }
`

export const Textfield_styled2 = styled.input`
    width: 100%;
    padding: 10px;
    font-size: 20px;
    border: 2px solid #ccc;
    outline: none;
    border-radius: 9px;
    background-color: transparent;
    transition: all .3s;
    margin-top: 20px;
    margin-bottom: 20px;


    &:focus{
        border-color: deepskyblue;
        box-shadow: 0 0 5px  #fff;
    }
`
export const Textarea_styled = styled.textarea`
    width: 100%;
    padding: 10px;
    font-size: 20px;
    color: #fff;
    border: 2px solid #ccc;
    outline: none;
    border-radius: 9px;
    background-color: transparent;
    transition: all .3s;
    margin-top: 20px;


    &:focus{
        border-color: deepskyblue;
        box-shadow: 0 0 5px  #fff;
    }
`

export const StyledSelect = styled.select`
  font-size: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  color: #333;
  width: 200px;
  transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    border-color: #888;
  }

  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 5px rgba(0, 128, 0, 0.5);
  }

  /* Personnalisation des options */
  option {
    background-color: white;
    color: #333;
  }
`;


export const List_btn_styled = styled.div`
    border-radius: 15px;
    cursor:pointer;
    background-color: #fff;
    transition:all .3s;
    padding: 10px;
position: absolute;
top:15%;
left:21%;
display: flex;
   align-items: center;
   justify-content: center;
   gap:3;
   font-weight: 550;
   color: deepskyblue;
   box-shadow: 0 0 3px #000;
   
  &:hover{
    background:#ccc;
  }

    img{
        max-width: 40px;
    }
`

export const Side_bar_wrapper = styled.div`
padding: 10px;
height: 100vh;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
background-color: #ccc;
position: sticky;
top: 0;

`

export const Card_container = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 100%;
padding: 20px;

`
export const Card_box = styled.div`
    display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
gap: 30px;
width: 100%;
height: 100%;
padding: 20px;
width: 100%;
`

