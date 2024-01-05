import { useState, useEffect } from 'react';
import './fallacyList.css';

const convertToCSV = (data) => {
    let csvStr = 'Category,Name,Description,Count\n';

    for (let category in data) {
        data[category].forEach(({ name, description, count = 0 }) => {
            // Ensure description is a string and escape double quotes
            description = description ? description.toString().replace(/"/g, '""') : '';
            let line = `"${category}","${name}","${description}","${count}"\n`;
            csvStr += line;
        });
    }

    return csvStr;
};

const initialFallacies = {
    'Irrelevance Fallacies': [
      { name: 'Ad Hominem', description: 'Attacking the person instead of the argument.' },
      { name: 'Straw Man', description: 'Misrepresenting the argument to make it easier to refute.' },
      { name: 'Appeal to Emotion', description: 'Using emotions instead of logical arguments.' },
      { name: 'Appeal to Authority', description: 'Using the opinions of famous people as an argument.' },
      { name: 'Red Herring', description: 'Introducing irrelevant information to divert attention.' },
    ],
    'Causal Fallacies': [
      { name: 'False Cause', description: 'Assuming a causal relationship based on mere chronological sequence.' },
      { name: 'Slippery Slope', description: 'Arguing that a small step will inevitably lead to a chain of catastrophic events.' },
      { name: 'Post Hoc Ergo Propter Hoc', description: 'Assuming that the event that follows another event is caused by it.' },
      { name: 'Circular Cause and Consequence', description: 'Explaining an event by its own outcome.' },
      { name: 'Appeal to Future', description: 'Arguing that something that will happen in the future is evidence of its truth now.' },
    ],
    'Presumptive Fallacies': [
      { name: 'Hasty Generalization', description: 'Making a generalization based on a few examples.' },
      { name: 'Begging the Question', description: 'Using assumptions that are not proven in the argument.' },
      { name: 'Wishful Thinking', description: 'Believing something because it is desired.' },
      { name: 'False Equivalence', description: 'Comparing two different things as if they were equal.' },
      { name: 'Confirmation Bias', description: 'Focusing on information that supports one\'s prior beliefs.' },
    ],
    'Structural Fallacies': [
      { name: 'Overgeneralization', description: 'Oversimplifying things.' },
      { name: 'False Dilemma', description: 'Offering only two options and ignoring alternatives.' },
      { name: 'Argumentum ad Numerum', description: 'Assuming that popularity equals validity.' },
      { name: 'Appeal to Tradition', description: 'Assuming that traditions are always correct.' },
      { name: 'Appeal to Fear', description: 'Using fear as a tool of persuasion.' },
    ],
    'Proof Fallacies': [
      { name: 'Appeal to Ignorance', description: 'Assuming that something is true because it has not been proven false.' },
      { name: 'Confirmation Bias', description: 'Selectively choosing evidence that confirms one\'s existing beliefs.' },
      { name: 'Appeal to Rarity', description: 'Assuming that rarity equals value or validity.' },
      { name: 'Appeal to Precedent', description: 'Assuming that things should remain the same because they have been that way in the past.' },
      { name: 'Appeal to Impossibility', description: 'Claiming that something is impossible because it is difficult to imagine.' },
    ]
};  

const FallacyList = () => {
    const [fallacyData, setFallacyData] = useState(() => {
        const savedData = localStorage.getItem('fallacyData');
        return savedData ? JSON.parse(savedData) : initialFallacies;
    });
    const [activeDescription, setActiveDescription] = useState('');

    const downloadCSV = () => {
        const csvStr = convertToCSV(fallacyData);
        const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
    
        // Create a link and trigger the download
        const virtualLink = document.createElement('a');
        virtualLink.href = url;
        virtualLink.setAttribute('download', 'fallacy-data.csv');
        virtualLink.style.display = 'none';
        document.body.appendChild(virtualLink);
    
        virtualLink.click();
    
        // Cleanup
        document.body.removeChild(virtualLink);
        URL.revokeObjectURL(url);
    };
    
    useEffect(() => {
        localStorage.setItem('fallacyData', JSON.stringify(fallacyData));
    }, [fallacyData]);

    const resetFallacyData = () => {
        setFallacyData(initialFallacies);
        localStorage.removeItem('fallacyData'); // Clearing data from local storage
    };

    const incrementCounter = (category, name) => {
        setFallacyData(prevFallacies => ({
            ...prevFallacies,
            [category]: prevFallacies[category].map(fallacy => 
                fallacy.name === name ? { ...fallacy, count: (fallacy.count || 0) + 1 } : fallacy
            )
        }));
    };

    const handleDescriptionHover = (description) => {
        setActiveDescription(description);
    };

    return (
        <div className="fallacy-list">
        {Object.entries(fallacyData).map(([category, fallacies]) => (
            <section key={category}>
            <header>
                <h2>{category}</h2>
            </header>
            <ul>
                {fallacies.map(fallacy => (
                <li key={fallacy.name}>
                    <button className='info-icon'
                        onClick={() => handleDescriptionHover(fallacy.description)}
                        onMouseLeave={() => handleDescriptionHover('')}
                    >
                        i
                    </button>
                    <span className="fallacy-name"
                        onClick={() => incrementCounter(category, fallacy.name)}
                    >
                        {fallacy.name}
                    </span>

                    {activeDescription === fallacy.description && (
                        <p className="fallacy-description">{fallacy.description}</p>
                    )}
                    <span className="fallacy-counter"> {fallacy.count || ''}</span>
                </li>
                
                ))}
            </ul>
            </section>
        ))}
        <div className="dash-board">
        <button className='reset-button' onClick={resetFallacyData}>Reset</button>
        <button className='export-button' onClick={downloadCSV}>Download</button>
        </div>
        </div>
    );
};
  
export default FallacyList;  