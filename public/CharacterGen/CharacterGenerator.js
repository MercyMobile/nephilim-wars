import React, { useState } from 'react';
import { generateAncientPrompt } from './utils/promptBuilder'; // The helper we discussed earlier

const CharacterGenerator = ({ onSave }) => {
  // 1. Internal State (The Main App doesn't need to know about this yet)
  const [formData, setFormData] = useState({
    name: '',
    race: 'Human (Sethite)',
    class: 'Shepherd',
    skinTone: 'Olive',
    eyeColor: 'Brown',
    hairColor: 'Black',
    gender: 'Male'
  });
  
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Handle Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. The "Magic" Button Logic
  const handleGenerate = async () => {
    setIsLoading(true);
    
    // Create the rich text prompt using our helper
    const prompt = generateAncientPrompt(formData);

    try {
      // Call your Netlify function
      const response = await fetch('/.netlify/functions/generate-avatar', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      
      // Assuming data.image is the Base64 string from Nano Banana
      // We add the data prefix so the browser knows it's an image
      setAvatarUrl(`data:image/jpeg;base64,${data.image}`);
      
    } catch (error) {
      console.error("Summoning failed:", error);
      alert("The spirits are silent (API Error). Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. The Output Handoff
  const handleSave = () => {
    if (!avatarUrl) return;
    
    // Bundle everything up and send it to the Main App
    const finalCharacter = {
      ...formData,
      avatar: avatarUrl,
      createdAt: new Date().toISOString()
    };

    // This is the ONLY integration point!
    onSave(finalCharacter); 
  };

  return (
    <div className="p-6 bg-slate-900 text-amber-50 rounded-lg border-2 border-amber-700 max-w-md mx-auto shadow-xl">
      <h2 className="text-2xl font-serif mb-4 text-amber-500 border-b border-amber-800 pb-2">Create New Lineage</h2>
      
      {/* --- FORM SECTION --- */}
      <div className="space-y-3 mb-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400">Name</label>
          <input 
            name="name" 
            type="text" 
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-600 p-2 rounded text-white"
            placeholder="e.g. Enoch"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400">Lineage (Race)</label>
            <select name="race" onChange={handleChange} className="w-full bg-slate-800 border border-slate-600 p-2 rounded">
              <option>Human (Sethite)</option>
              <option>Human (Cainite)</option>
              <option>Nephilim (Gibborim)</option>
              <option>Rephaim</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400">Role</label>
            <select name="class" onChange={handleChange} className="w-full bg-slate-800 border border-slate-600 p-2 rounded">
              <option>Shepherd</option>
              <option>Warrior</option>
              <option>Priest</option>
              <option>Scribe</option>
            </select>
          </div>
        </div>

        {/* Add more dropdowns for Eyes/Hair/Skin here... */}
      </div>

      {/* --- ACTION SECTION --- */}
      <div className="flex flex-col items-center gap-4">
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded shadow-lg transition-all disabled:opacity-50"
        >
          {isLoading ? "Consulting the Oracle..." : "Visualize Character"}
        </button>

        {/* IMAGE PREVIEW */}
        {avatarUrl && (
          <div className="animate-fade-in text-center">
            <img 
              src={avatarUrl} 
              alt="Generated Avatar" 
              className="rounded-lg border-4 border-amber-600 shadow-2xl mb-4 max-h-64 object-cover"
            />
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-green-700 hover:bg-green-600 text-white rounded font-bold"
            >
              Accept & Save Character
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterGenerator;