import React, { useEffect, useState } from 'react';
import DiscussionCard from './DiscussionCard'; // Ensure the path is correct based on your file structure

const DiscussionList = ({ selectedTag }) => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscussions = async () => {
      setLoading(true);
      try {
        let url = 'http://34.45.189.129:3000/questions';
        if (selectedTag) {
          url = `http://34.45.189.129:3000/tags/${selectedTag}`;
        }
        console.log('Fetching discussions with tag:', selectedTag); // Log selected tag
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch discussions');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log to see the full response
        setDiscussions(data.questions || data.discussions); // Ensure to set the correct state
        setLoading(false);
      } catch (error) {
        console.error('Error fetching discussions:', error);
        setLoading(false);
        // Handle error state here (e.g., set an error state)
      }
    };

    fetchDiscussions();
  }, [selectedTag]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Ensure discussions is an array and not empty
  if (!Array.isArray(discussions) || discussions.length === 0) {
    return <div>No discussions found.</div>;
  }

  return (
    <div className="space-y-6">
      {discussions.map(discussion => (
        <DiscussionCard key={discussion._id} discussion={discussion} />
      ))}
    </div>
  );
};

export default DiscussionList;
