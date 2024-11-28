import React from 'react'
import service_icone from "../assets/service2.png"
import doc_icone from "../assets/document2.png"
import meta_icone from "../assets/meta2.png"
import doc_type_icone from "../assets/doc_type2.png"

export default function Card_icone() {
  return (
    <div className='card_icone'>
        <div className="up_bar">
            <h2>Gérer vos différentes activités</h2>
        </div>
        <div className="container">
        <div className="item">
           <div className="box">
           <img src={service_icone} alt="" />
           <h3>Les services</h3>
           </div>
            <div className="content">
                <p>Lorem ipsum dolor sit amet consectetur 
                </p>
            </div>
        </div>
        <div className="item">
            <div className="box">
            <img src={doc_type_icone} alt="" />
            <h3>Les types de documents</h3>
            </div>
            <div className="content">
                <p>Lorem ipsum dolor sit amet consectetur 
               </p>
            </div>
        </div>
        <div className="item">
         <div className="box">
         <img src={doc_icone} alt="" />
         <h3>Les documents</h3>
         </div>
            <div className="content">
                <p>Lorem ipsum dolor sit amet consectetur 
               </p>
            </div>
        </div>
        <div className="item">
           <div className="box">
           <img src={meta_icone} alt="" />
           <h3>Les metadonnées</h3>
           </div>
            <div className="content">
                <p>Lorem ipsum dolor sit amet consectetur 
                </p>
            </div>
        </div>
        </div>
    </div>
  )
}
