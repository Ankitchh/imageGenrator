import React, { useState, useRef } from "react";
import {
  Camera,
  Download,
  Sparkles,
  Wand2,
  Loader,
  RefreshCw,
  Settings,
} from "lucide-react";
import axios from "axios";


const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  const styles = [
    { id: "realistic", name: "Realistic", desc: "Photorealistic images" },
    { id: "artistic", name: "Artistic", desc: "Painting-like style" },
    { id: "cartoon", name: "Cartoon", desc: "Animated cartoon style" },
    { id: "abstract", name: "Abstract", desc: "Abstract art style" },
    { id: "cyberpunk", name: "Cyberpunk", desc: "Futuristic neon style" },
  ];


  // Simulate Gemini AI prompt enhancement
  const enhancePrompt = async () => {
    if (!prompt.trim()) return;

    setIsEnhancing(true);
    setError("");

    try {
      // Simulate API call to Gemini for prompt enhancement
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const styleModifiers = {
        realistic:
          "professional photography, high detail, sharp focus, realistic lighting",
        artistic:
          "oil painting style, artistic brush strokes, vibrant colors, fine art",
        cartoon: "3D cartoon style, colorful, playful, animated movie quality",
        abstract:
          "abstract art, geometric shapes, bold colors, modern art style",
        cyberpunk:
          "cyberpunk aesthetic, neon lights, futuristic, dark atmosphere, sci-fi",
      };

      const enhanced = `${prompt}, ${styleModifiers[selectedStyle]}, masterpiece, best quality, ultra detailed, 4k resolution`;
      setEnhancedPrompt(enhanced);
    } catch (err) {
      setError("Failed to enhance prompt. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  };

  // Simulate image generation (replace with actual API calls)
  const generateImage = async () => {
    const finalPrompt = enhancedPrompt || prompt;
    if (!finalPrompt.trim()) return;

    setIsGenerating(true);
    setError("");
    setGeneratedImage(null);

    try {
      const response = await axios.post("http://localhost:3000/generate", {
        prompt: finalPrompt,
      });
      console.log(response.data);
      // const id = response.data.file;
      
      setGeneratedImage(response.data.imageUrl);

     
    } catch (err) {
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.download = `ai-generated-${Date.now()}.png`;
    link.href = generatedImage;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Camera className="w-8 h-8 text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">
              AI Image Generator
            </h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Create stunning images using AI. Enhance your prompts with Gemini AI
            for better results.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <label className="block text-white font-medium mb-3">
                <Wand2 className="w-4 h-4 inline mr-2" />
                Describe your image
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A majestic dragon flying over a fantasy landscape..."
                className="w-full h-24 bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />

              <button
                onClick={enhancePrompt}
                disabled={isEnhancing || !prompt.trim()}
                className="mt-3 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                {isEnhancing ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>
                  {isEnhancing ? "Enhancing..." : "Enhance with Gemini AI"}
                </span>
              </button>
            </div>

            {/* Enhanced Prompt Display */}
            {enhancedPrompt && (
              <div className="bg-green-500/10 backdrop-blur-md rounded-xl p-6 border border-green-400/30">
                <label className="block text-green-300 font-medium mb-3">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Enhanced Prompt
                </label>
                <div className="bg-white/10 rounded-lg p-3 text-white text-sm">
                  {enhancedPrompt}
                </div>
              </div>
            )}

            {/* Style Selection */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <label className="block text-white font-medium mb-3">
                <Settings className="w-4 h-4 inline mr-2" />
                Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-3 rounded-lg text-left transition-colors ${
                      selectedStyle === style.id
                        ? "bg-purple-600 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    <div className="font-medium">{style.name}</div>
                    <div className="text-xs opacity-75">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>


            {/* Generate Button */}
            <button
              onClick={generateImage}
              disabled={isGenerating || (!prompt.trim() && !enhancedPrompt)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 text-lg transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  <span>Generate Image</span>
                </>
              )}
            </button>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300">
                {error}
              </div>
            )}
          </div>

          {/* Right Panel - Generated Image */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-medium text-lg">
                Generated Image
              </h3>
              {generatedImage && (
                <button
                  onClick={downloadImage}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="aspect-square bg-gray-800/50 rounded-lg flex items-center justify-center overflow-hidden">
              {isGenerating ? (
                <div className="text-center text-gray-400">
                  <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
                  <p>Generating your image...</p>
                  <p className="text-sm mt-2">This may take a few moments</p>
                </div>
              ) : generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <img src={`${generatedImage}`} alt="" />
                  <p className="text-sm mt-2">
                    Enter a prompt and click generate
                  </p>
                </div>
              )}
            </div>

            {/* Hidden canvas for image generation */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
