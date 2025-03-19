'use client';

import React, { useState, useRef, useEffect } from 'react';
import style from '@/css/Skillup.module.css';
import Image from 'next/image';
import calculas from '../../../assets/calculas.png'; // Placeholder image
import { useSkillup } from '@/context/SkillContext';

const SkillUpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBot, setSelectedBot] = useState(null); // State to store selected bot details
  const { getSkillupList, skillupList, handleStartLesson } = useSkillup();

  const categoryRefs = useRef({}); // Store refs dynamically
  const [groupedCategories, setGroupedCategories] = useState([]);

  // Group skillupList by title
  useEffect(() => {
    getSkillupList();
  }, []);

  useEffect(() => {
    if (skillupList.length > 0) {
      const grouped = skillupList.reduce((acc, skill) => {
        const { title, category, summary,_id,subCategory } = skill;

        // Ensure a category exists in the accumulator
        if (!acc[title]) {
          acc[title] = {
            title,
            ref: React.createRef(), // Create ref for each title
            bots: [],
          };
        }

        // Push bot data into the category
        acc[title].bots.push({
          _id,
          name: category,
          description: summary,
          author: 'IvyAITutor',
          image: calculas,
          subCategory
        });

        return acc;
      }, {});

      setGroupedCategories(Object.values(grouped)); // Convert grouped object into an array
    }
  }, [skillupList]);

  // Filtered categories based on search query
  const filteredCategories = groupedCategories
    .map((category) => ({
      ...category,
      bots: category.bots.filter(
        (bot) =>
          bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bot.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(
      (category) =>
        category.bots.length > 0 ||
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className={style.container}>
      <h1 className={style.title}>SkillUp</h1>
      <p className={style.subtitle}>
        Discover bots to help you understand a specific topic in your studies or research.
      </p>
      <div className={style.searchContainer}>
        <input
          type="text"
          className={style.searchInput}
          placeholder="Search bots"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className={style.searchButton}>Search</button>
      </div>
      <div className={style.navContainer}>
        {groupedCategories.map((category, index) => (
          <button
            key={index}
            className={style.navButton}
            onClick={() =>
              category.ref.current.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {category.title}
          </button>
        ))}
      </div>
      <div className={style.categories}>
        {filteredCategories.map((category, index) => (
          <div key={index} ref={category.ref} className={style.category}>
            <h3 className={style.categoryTitle}>{category.title}</h3>
            <div className={style.bots}>
              {category.bots.map((bot, botIndex) => (
                <div
                  key={botIndex}
                  className={style.botCard}
                  onClick={() => setSelectedBot(bot)} // Set selected bot when clicked
                >
                  <div className={style.botImageContainer}>
                    <Image
                      src={bot.image}
                      alt={bot.name}
                      width={40}
                      height={40}
                      className={style.botImage}
                    />
                  </div>
                  <div className={style.botDetails}>
                    <h4 className={style.botName}>{bot.name}</h4>
                    <p className={style.botDescription}>{bot.description.slice(0,150)}...</p>
                    <p className={style.botAuthor}>By {bot.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <p className={style.noResults}>
            No bots or categories found matching your search.
          </p>
        )}
      </div>

      {/* Modal for bot details */}
      {selectedBot && (
        <div className={style.modal}>
          <div className={style.modalContent}>
            <button
              className={style.closeButton}
              onClick={() => setSelectedBot(null)}
            >
              &times;
            </button>
            <Image
              src={selectedBot.image}
              alt={selectedBot.name}
              width={80}
              height={80}
              className={style.modalImage}
            />
            <h2>{selectedBot.name}</h2>
            <p>
              <strong>By:</strong> {selectedBot.author}
            </p>
            <p><strong>Summary:</strong> {selectedBot.description}</p>
           
            {selectedBot.subCategory && selectedBot.subCategory.length > 0 && (
        <div>
          <strong>Topics:</strong> {selectedBot.subCategory.join(', ')}
        </div>
      )}
            {console.log(selectedBot)}
            <div className={style.modalButtons}>
              {/* <button className={style.modalButton}>Start Chat</button>
              <button className={style.modalButton}>Start Quiz</button> */}
              <button className={style.modalButton} onClick={()=>handleStartLesson(selectedBot._id)}>Start Lesson</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillUpPage;
