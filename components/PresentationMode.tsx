'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PresentationModeProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export function PresentationMode({ children, isOpen, onClose }: PresentationModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = Array.isArray(children) ? children : [children];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header de Controle */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between px-8 z-10">
        <div className="text-white/60 text-sm">
          Slide {currentSlide + 1} / {slides.length}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="text-white hover:bg-white/10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/10 ml-4"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Conteúdo do Slide */}
      <div className="h-full w-full flex items-center justify-center p-16">
        <div className="w-full h-full max-w-[1400px] animate-fade-in">
          {slides[currentSlide]}
        </div>
      </div>

      {/* Indicadores de Slide */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Dicas de Navegação */}
      <div className="absolute bottom-8 right-8 text-white/40 text-xs">
        Use ← → ou espaço para navegar • ESC para sair
      </div>
    </div>
  );
}
