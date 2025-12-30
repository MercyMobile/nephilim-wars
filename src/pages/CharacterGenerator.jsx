import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you use React Router

const CharacterGenerator = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Call your Cloudflare Worker
      const response = await fetch('https://nephilim-wars.pages.dev/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.details || 'Generation failed');

      // 2. The worker returns base64. We add the prefix to make it viewable.
      setGeneratedImage(`data:image/jpeg;base64,${data.image}`);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndStart = () => {
    if (!name || !generatedImage) return;

    // 3. Define the character stats (You can make these random or input fields later)
    const newCharacter = {
      id: 'p1',
      name: name,
      isPlayer: true,
      portrait: generatedImage, // <--- The image from the API
      hp: 50,
      maxHp: 50,
      defense: 14,
      initiativeBonus: 3,
      rp: 5, // Starting Righteousness Points
      cp: 0, // Starting Corruption Points
      actions: [
        { id: 'gen1', name: 'Generated Strike', type: 'melee', cost: 1, damageDice: '1d8', damageType: 'physical' }
      ]
    };

    // 4. Save to Local Storage
    localStorage.setItem('generatedCharacter', JSON.stringify(newCharacter));

    // 5. Go to Combat
    navigate('/combat');
  };

  return (
    <div className="min-h-screen bg-stone-900 text-amber-100 p-8 flex flex-col items-center font-serif">
      <h1 className="text-4xl text-amber-500 mb-8 font-bold border-b border-amber-800 pb-4">Soul Forge</h1>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT: Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm uppercase tracking-widest text-stone-500 mb-2">Character Name</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-stone-700 p-3 text-xl focus:border-amber-500 outline-none rounded"
              placeholder="e.g. Enoch the Wanderer"
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-stone-500 mb-2">Visual Prompt</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 bg-black border border-stone-700 p-3 focus:border-amber-500 outline-none rounded resize-none"
              placeholder="Describe your character... e.g. 'A rugged ancient hebrew warrior with a bronze sword, glowing blue eyes, digital painting style'"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className={`w-full py-4 font-bold tracking-widest uppercase transition-all ${
              loading ? 'bg-stone-800 text-stone-500' : 'bg-amber-700 hover:bg-amber-600 text-white shadow-[0_0_20px_rgba(180,83,9,0.4)]'
            }`}
          >
            {loading ? 'Communing with the Machine...' : 'Generate Portrait'}
          </button>

          {error && <div className="text-red-500 bg-red-900/20 p-4 border border-red-800 rounded">{error}</div>}
        </div>

        {/* RIGHT: Preview */}
        <div className="flex flex-col items-center justify-center bg-black border-2 border-dashed border-stone-800 rounded-lg min-h-[400px] relative overflow-hidden">
          {generatedImage ? (
            <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
          ) : (
            <div className="text-stone-600 text-center">
              <div className="text-6xl mb-4">🔮</div>
              <p>Portrait will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER: Save Button */}
      {generatedImage && name && (
        <button 
          onClick={handleSaveAndStart}
          className="mt-12 bg-green-800 border border-green-500 text-green-100 px-12 py-4 text-2xl font-bold rounded shadow-[0_0_30px_rgba(22,163,74,0.3)] hover:scale-105 transition-transform"
        >
          Accept Soul & Enter Combat
        </button>
      )}
    </div>
  );
};

export default CharacterGenerator;