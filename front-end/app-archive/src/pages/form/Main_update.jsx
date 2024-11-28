// src/pages/EditPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Side_bar from '../../Components/Side_bar';
import Top_bar from '../../Components/Top_bar';
import EditForm from './Update_form';
import { MainWrapper, ContentWrapper } from '../../style-components/main.styled';

const Main_update = () => {
  const { category, id } = useParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        console.log('Fetching item for category:', category, 'and ID:', id);
        const response = await axios.get(`http://localhost:3000/${category}/${id}`);
        console.log('API Response:', response.data);
        console.log('Selected Item:', selectedItem);
        setSelectedItem(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching item:', error);
        setLoading(false);
      }
    };

    fetchItem();
  }, [category, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!selectedItem) {
    return <div>No data found</div>;
  }

  return (
    <div className="edit_page">
      <Side_bar />
      <MainWrapper>
        <Top_bar />
        <ContentWrapper>
          <EditForm item={selectedItem} category={category} />
        </ContentWrapper>
      </MainWrapper>
    </div>
  );
};

export default Main_update;
