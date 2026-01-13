"use client";
import { useState, useRef } from 'react';
import {
    Sparkles,
    FileText,
    Image as ImageIcon,
    Calendar as CalendarIcon,
    Palette,
    Zap,
    Copy,
    Download,
    RefreshCw,
    Upload,
    X,
    Wand2
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

type ContentType = 'copy' | 'briefing' | 'prompt' | 'calendar' | 'script' | 'email';
type Tone = 'professional' | 'casual' | 'creative' | 'formal' | 'friendly';
type Platform = 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'email' | 'website';

const CONTENT_TYPES = [
    { id: 'copy' as const, label: 'Copywriting', icon: FileText, desc: 'Posts, legendas, CTAs' },
    { id: 'briefing' as const, label: 'Briefing Visual', icon: Palette, desc: 'Para designers' },
    { id: 'prompt' as const, label: 'Prompt Imagem', icon: ImageIcon, desc: 'Midjourne, DALL-E' },
    { id: 'calendar' as const, label: 'Calendário', icon: CalendarIcon, desc: 'Planejamento mensal' },
    { id: 'script' as const, label: 'Roteiro', icon: Zap, desc: 'Vídeos e reels' },
    { id: 'email' as const, label: 'Email Marketing', icon: FileText, desc: 'Sequências de email' }
];

const TONES = [
    { value: 'professional' as const, label: 'Profissional', emoji: '💼' },
    { value: 'casual' as const, label: 'Casual', emoji: '😊' },
    { value: 'creative' as const, label: 'Criativo', emoji: '🎨' },
    { value: 'formal' as const, label: 'Formal', emoji: '🎩' },
    { value: 'friendly' as const, label: 'Amigável', emoji: '👋' }
];

const PLATFORMS = [
    { value: 'instagram' as const, label: 'Instagram', color: 'bg-pink-500' },
    { value: 'linkedin' as const, label: 'LinkedIn', color: 'bg-blue-600' },
    { value: 'twitter' as const, label: 'Twitter', color: 'bg-sky-500' },
    { value: 'facebook' as const, label: 'Facebook', color: 'bg-blue-500' },
    { value: 'email' as const, label: 'Email', color: 'bg-violet-500' },
    { value: 'website' as const, label: 'Website', color: 'bg-slate-500' }
];

export default function ContentStudio() {
    const { clients } = useAppStore();
    const [selectedType, setSelectedType] = useState<ContentType>('copy');
    const [selectedClient, setSelectedClient] = useState('');
    const [tone, setTone] = useState<Tone>('professional');
    const [platform, setPlatform] = useState<Platform>('instagram');
    const [objective, setObjective] = useState('');
    const [keywords, setKeywords] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [duration, setDuration] = useState('30s');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setUploadedImage(null);
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleGenerate = async () => {
        setLoading(true);

        try {
            let imageBase64 = null;

            // If there's an uploaded image for prompt generation
            if (uploadedImage && selectedType === 'prompt') {
                imageBase64 = uploadedImage.split(',')[1]; // Remove data:image/... prefix
            }

            const response = await fetch('/api/generate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: selectedType,
                    client: selectedClient,
                    tone,
                    platform,
                    objective,
                    keywords,
                    targetAudience,
                    duration,
                    imageBase64 // Send image for analysis
                })
            });

            const data = await response.json();
            setResults(data.options || []);
        } catch (error) {
            console.error('Error generating content:', error);
            alert('Erro ao gerar conteúdo. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copiado!');
    };

    const selectedTypeData = CONTENT_TYPES.find(t => t.id === selectedType);

    return (
        <div className="min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-pink-600 rounded-xl flex items-center justify-center">
                        <Wand2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">IA Content Studio</h1>
                        <p className="text-slate-400">Gere conteúdo profissional em segundos com IA</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Configuration */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Type Selector */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
                            Tipo de Conteúdo
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {CONTENT_TYPES.map(type => {
                                const Icon = type.icon;
                                const isSelected = selectedType === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${isSelected
                                                ? 'border-violet-600 bg-violet-600/10'
                                                : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-violet-400' : 'text-slate-500'}`} />
                                        <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                            {type.label}
                                        </p>
                                        <p className="text-xs text-slate-600 mt-1">{type.desc}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Client Selector */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <label className="text-sm font-semibold text-slate-400 uppercase tracking-wide block mb-3">
                            Cliente
                        </label>
                        <select
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-violet-600 focus:outline-none"
                        >
                            <option value="">Selecione um cliente</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.company_name}>
                                    {client.company_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Platform */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <label className="text-sm font-semibold text-slate-400 uppercase tracking-wide block mb-3">
                            Plataforma
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {PLATFORMS.map(plat => (
                                <button
                                    key={plat.value}
                                    onClick={() => setPlatform(plat.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${platform === plat.value
                                            ? `${plat.color} text-white`
                                            : 'bg-slate-950 text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {plat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tone */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <label className="text-sm font-semibold text-slate-400 uppercase tracking-wide block mb-3">
                            Tom de Voz
                        </label>
                        <div className="space-y-2">
                            {TONES.map(t => (
                                <button
                                    key={t.value}
                                    onClick={() => setTone(t.value)}
                                    className={`w-full px-4 py-3 rounded-lg text-left transition-all ${tone === t.value
                                            ? 'bg-violet-600 text-white'
                                            : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                                        }`}
                                >
                                    <span className="mr-2">{t.emoji}</span>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Middle Panel - Inputs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Configuration */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-violet-400" />
                            Configurações de Geração
                        </h3>

                        <div className="space-y-4">
                            {/* Image Upload (only for Prompt type) */}
                            {selectedType === 'prompt' && (
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-2">
                                        📸 Anexar Imagem de Referência (Opcional)
                                    </label>

                                    {!uploadedImage ? (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-slate-700 hover:border-violet-600 rounded-lg p-8 text-center cursor-pointer transition-colors"
                                        >
                                            <Upload className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                                            <p className="text-sm text-slate-400 mb-1">
                                                Arraste uma imagem ou clique para selecionar
                                            </p>
                                            <p className="text-xs text-slate-600">
                                                A IA vai analisar e gerar prompts baseados nesta imagem
                                            </p>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative border border-slate-700 rounded-lg p-4">
                                            <button
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 p-2 bg-slate-900 hover:bg-red-600 rounded-full transition-colors"
                                            >
                                                <X className="w-4 h-4 text-white" />
                                            </button>
                                            <img
                                                src={uploadedImage}
                                                alt="Uploaded"
                                                className="w-full h-64 object-contain rounded-lg"
                                            />
                                            <p className="text-xs text-violet-400 mt-2 text-center">
                                                ✨ IA vai analisar esta imagem para gerar prompts inteligentes
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Objective */}
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">
                                    Objetivo do Conteúdo *
                                </label>
                                <textarea
                                    value={objective}
                                    onChange={(e) => setObjective(e.target.value)}
                                    placeholder="Ex: Aumentar engajamento, divulgar novo produto, educar sobre serviço..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:border-violet-600 focus:outline-none resize-none"
                                    rows={3}
                                />
                            </div>

                            {/* Keywords */}
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">
                                    Palavras-chave
                                </label>
                                <input
                                    type="text"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    placeholder="Ex: inovação, tecnologia, sustentabilidade..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:border-violet-600 focus:outline-none"
                                />
                            </div>

                            {/* Target Audience */}
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">
                                    Público-Alvo
                                </label>
                                <input
                                    type="text"
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    placeholder="Ex: Empresários de 30-45 anos, profissionais de marketing..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:border-violet-600 focus:outline-none"
                                />
                            </div>

                            {/* Duration (for scripts) */}
                            {selectedType === 'script' && (
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-2">
                                        Duração do Vídeo
                                    </label>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-violet-600 focus:outline-none"
                                    >
                                        <option value="15s">15 segundos</option>
                                        <option value="30s">30 segundos</option>
                                        <option value="60s">1 minuto</option>
                                        <option value="3min">3 minutos</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !objective}
                            className="w-full mt-6 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-violet-900/30 disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    {uploadedImage && selectedType === 'prompt' ? 'Analisando imagem e gerando...' : 'Gerando conteúdo incrível...'}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Gerar {selectedTypeData?.label}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results */}
                    {results.length > 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Resultados Gerados ({results.length})
                            </h3>

                            <div className="space-y-4">
                                {results.map((result, index) => (
                                    <div
                                        key={index}
                                        className="bg-slate-950 border border-slate-800 rounded-lg p-6 hover:border-violet-600/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <span className="text-sm font-semibold text-violet-400">
                                                Opção {index + 1}
                                            </span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => copyToClipboard(result)}
                                                    className="p-2 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"
                                                    title="Copiar"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                                            {result}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleGenerate}
                                className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Gerar Novas Opções
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && results.length === 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                            <Wand2 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-400 mb-2">
                                Pronto para gerar conteúdo incrível?
                            </h3>
                            <p className="text-sm text-slate-600">
                                {selectedType === 'prompt' && !uploadedImage
                                    ? 'Anexe uma imagem (opcional) e preencha o objetivo para gerar prompts inteligentes'
                                    : 'Preencha as configurações e clique em "Gerar" para criar conteúdo profissional com IA'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
