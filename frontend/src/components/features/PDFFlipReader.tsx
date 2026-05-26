"use client";

import React, { useState, useRef, useEffect, forwardRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2,
  Loader2,
  Book as BookIcon,
  Type,
  AlignLeft,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFFlipReaderProps {
  fileUrl: string;
  onClose: () => void;
  title?: string;
}

const PageElement = forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <div 
      className={cn("page-content bg-[#FBF9F4] shadow-2xl relative overflow-hidden", props.className)} 
      ref={ref} 
      data-density={props.density || "soft"}
      style={{ width: props.width, height: props.height }}
    >
      {/* Paper Surface Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
      
      {/* Spine / Gutter Depth */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/[0.06] to-transparent pointer-events-none z-20" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/[0.06] to-transparent pointer-events-none z-20" />
      
      {/* Page Volume Light */}
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/[0.02] to-transparent pointer-events-none z-10" />
      
      <div className="w-full h-full flex flex-col items-center justify-center p-0 relative bg-transparent">
        {props.children}
      </div>
      
      {/* Page Footer */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2 opacity-30 select-none z-30">
        <div className="w-6 h-px bg-black" />
        <span className="text-[10px] font-black font-mono text-black">{props.pageNumber}</span>
        <div className="w-6 h-px bg-black" />
      </div>
    </div>
  );
});

PageElement.displayName = "PageElement";

export const PDFFlipReader = ({ fileUrl, onClose, title }: PDFFlipReaderProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);
  const [readMode, setReadMode] = useState<"book" | "reflow">("book");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  
  // Real PDF text extraction states for zero mock compliance
  const [pagesText, setPagesText] = useState<{ [pageNum: number]: string }>({});
  const [isLoadingText, setIsLoadingText] = useState<{ [pageNum: number]: boolean }>({});
  
  const flipBookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = (pdf: any) => {
    setNumPages(pdf.numPages);
    setPdfDocument(pdf);
  };

  const nextPage = () => flipBookRef.current?.pageFlip()?.flipNext();
  const prevPage = () => flipBookRef.current?.pageFlip()?.flipPrev();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Asynchronous text extraction from PDF pages
  const loadPageText = async (pageNum: number) => {
    if (pagesText[pageNum] || isLoadingText[pageNum] || !pdfDocument) return;
    
    setIsLoadingText(prev => ({ ...prev, [pageNum]: true }));
    try {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map((item: any) => item.str);
      const pageText = textItems.join(" ").replace(/\s+/g, " ").trim();
      
      setPagesText(prev => ({ 
        ...prev, 
        [pageNum]: pageText || "Esta página não possui texto selecionável (provavelmente é uma imagem digitalizada). Utilize o Modo Facsimile 3D." 
      }));
    } catch (err) {
      console.error(`Erro ao extrair texto da página ${pageNum}:`, err);
      setPagesText(prev => ({ 
        ...prev, 
        [pageNum]: "Erro ao extrair conteúdo textual deste manuscrito." 
      }));
    } finally {
      setIsLoadingText(prev => ({ ...prev, [pageNum]: false }));
    }
  };

  // Reactively pre-load page text as reader navigates in reflow mode
  useEffect(() => {
    if (readMode === "reflow" && pdfDocument && numPages > 0) {
      const targetPage1 = currentPage + 1;
      const targetPage2 = currentPage + 2;
      
      if (targetPage1 <= numPages) loadPageText(targetPage1);
      if (targetPage2 <= numPages) loadPageText(targetPage2);
    }
  }, [currentPage, readMode, pdfDocument, numPages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
      if (e.key === "Escape" && !isFullscreen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [numPages, isFullscreen, readMode]);

  // Proportions
  const baseWidth = 550;
  const baseHeight = 820;
  const currentWidth = baseWidth * scale;
  const currentHeight = baseHeight * scale;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#070708] flex flex-col items-center justify-center overflow-hidden"
      ref={containerRef}
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(80,70,229,0.06)_0%,transparent_70%)] opacity-50" />
      
      <div className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-10 bg-black/40 backdrop-blur-3xl border-b border-white/5 z-40">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-2xl shadow-primary/10">
            <BookIcon size={24} />
          </div>
          <div>
            <h3 className="text-white font-black tracking-tighter text-xl uppercase leading-none">{title || "Manuscrito Digital"}</h3>
            <div className="flex items-center gap-3 mt-2">
               <span className="text-[9px] text-primary font-black uppercase tracking-[0.3em]">Ambiente Premium</span>
               <div className="w-1 h-1 rounded-full bg-white/20" />
               <span className="text-[9px] text-emerald-500 font-black uppercase tracking-[0.3em]">Texto Extraído</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1 mr-2">
             <button 
              onClick={() => setReadMode("book")}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                readMode === "book" ? "bg-primary text-white shadow-lg" : "text-neutral-500 hover:text-white"
              )}
             >
                Facsimile 3D
             </button>
             <button 
              onClick={() => setReadMode("reflow")}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                readMode === "reflow" ? "bg-emerald-500 text-white shadow-lg" : "text-neutral-500 hover:text-white"
              )}
             >
                Modo Texto
             </button>
          </div>

          <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-400 hover:text-white" onClick={() => setScale(s => Math.max(0.6, s - 0.1))}>
              <ZoomOut size={18} />
            </Button>
            <span className="text-white/40 text-[10px] font-black w-12 text-center">{Math.round(scale * 100)}%</span>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-400 hover:text-white" onClick={() => setScale(s => Math.min(2.5, s + 0.1))}>
              <ZoomIn size={18} />
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="h-10 w-10 text-neutral-400 hover:text-white">
            {isFullscreen ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
          </Button>

          <Button variant="ghost" size="icon" onClick={onClose} className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/10">
            <X size={24} />
          </Button>
        </div>
      </div>

      <div className="w-full h-full flex flex-col items-center justify-center p-4 pt-24 pb-36 overflow-auto custom-scrollbar">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex flex-col items-center justify-center"
          loading={
            <div className="flex flex-col items-center gap-8">
              <Loader2 className="w-20 h-20 text-primary animate-spin" />
              <p className="text-white/20 font-black uppercase tracking-[0.6em] text-[10px]">Sincronizando Manuscrito Épico...</p>
            </div>
          }
        >
          {numPages > 0 && (
            <div className="relative group/reader">
              {/* FLIPBOOK WORKHORSE - HANDLES BOTH MODES */}
              <HTMLFlipBook
                style={{}}
                width={currentWidth}
                height={currentHeight}
                size="fixed"
                minWidth={300}
                maxWidth={2000}
                minHeight={400}
                maxHeight={2500}
                maxShadowOpacity={0.8}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={(e) => setCurrentPage(e.data)}
                className="book-3d shadow-[0_80px_160px_rgba(0,0,0,1)]"
                ref={flipBookRef}
                startPage={currentPage} // SINCRONIZAÇÃO ENTRE MODOS
                drawShadow={true}
                flippingTime={1000}
                usePortrait={false}
                startZIndex={0}
                autoSize={false}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
              >
                {/* RENDER PAGES BASED ON MODE */}
                {readMode === "book" ? (
                  Array.from(new Array(numPages), (el, index) => (
                    <PageElement 
                      key={`facsimile_${index + 1}`} 
                      pageNumber={index + 1}
                      width={currentWidth}
                      height={currentHeight}
                    >
                      <div className="w-full h-full flex items-center justify-center overflow-hidden">
                        <Page 
                          pageNumber={index + 1} 
                          width={currentWidth}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                          devicePixelRatio={Math.min(2.5, typeof window !== 'undefined' ? window.devicePixelRatio : 1)}
                          loading={null}
                          className="pdf-page-canvas"
                        />
                      </div>
                    </PageElement>
                  ))
                ) : (
                  // Virtual Text Pages for Reflow Mode - 100% Dynamic Text extraction
                  Array.from(new Array(numPages), (el, index) => {
                    const pageNum = index + 1;
                    const text = pagesText[pageNum];
                    const loading = isLoadingText[pageNum];
                    
                    return (
                      <PageElement 
                        key={`text_page_${pageNum}`} 
                        pageNumber={pageNum}
                        width={currentWidth}
                        height={currentHeight}
                        className="p-12 overflow-y-auto custom-scrollbar"
                      >
                        <div className="h-full flex flex-col prose prose-neutral prose-lg w-full text-black">
                           <h2 className="text-xl font-serif text-black/40 uppercase tracking-[0.4em] mb-8 border-b border-black/5 pb-3">
                             Página {pageNum}
                           </h2>
                           {loading ? (
                             <div className="flex-grow flex flex-col items-center justify-center gap-3 py-20">
                               <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                               <span className="text-xs font-mono text-neutral-500">Extraindo texto do PDF...</span>
                             </div>
                           ) : (
                             <p className="text-neutral-800 font-serif text-lg leading-[1.8] text-justify selection:bg-primary/20 whitespace-pre-wrap">
                               {text || "Aguardando carregamento e análise da página..."}
                             </p>
                           )}
                        </div>
                      </PageElement>
                    );
                  })
                )}
              </HTMLFlipBook>

              <button 
                onClick={prevPage}
                className={cn(
                  "absolute -left-32 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/2 border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-primary/20 hover:border-primary/20 transition-all opacity-0 group-hover/reader:opacity-100 hidden xl:flex shadow-2xl",
                  currentPage === 0 && "hidden"
                )}
              >
                <ChevronLeft size={48} strokeWidth={1} />
              </button>
              <button 
                onClick={nextPage}
                className={cn(
                  "absolute -right-32 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/2 border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-primary/20 hover:border-primary/20 transition-all opacity-0 group-hover/reader:opacity-100 hidden xl:flex shadow-2xl",
                  currentPage >= numPages - 1 && "hidden"
                )}
              >
                <ChevronRight size={48} strokeWidth={1} />
              </button>
            </div>
          )}
        </Document>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40">
        <div className="flex flex-col items-center gap-5">
          <div className="bg-black/60 backdrop-blur-3xl px-12 py-5 rounded-[3rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex items-center gap-12">
            <button onClick={prevPage} disabled={currentPage === 0} className="text-neutral-600 hover:text-white disabled:opacity-20 transition-all hover:scale-125 active:scale-75">
              <ChevronLeft size={36} />
            </button>
            <div className="flex flex-col items-center min-w-[150px]">
              <span className="text-white text-[11px] font-black tracking-[0.4em] mb-3 uppercase">
                {currentPage + 1} <span className="opacity-20 mx-3">/</span> {numPages}
              </span>
              <div className="w-56 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className={cn("h-full bg-gradient-to-r", readMode === "book" ? "from-primary to-blue-400" : "from-emerald-400 to-teal-400")}
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentPage + 1) / numPages) * 100}%` }}
                />
              </div>
            </div>
            <button onClick={nextPage} disabled={currentPage >= numPages - 1} className="text-neutral-600 hover:text-white disabled:opacity-20 transition-all hover:scale-125 active:scale-75">
              <ChevronRight size={36} />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .pdf-page-canvas canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          object-fit: contain !important;
        }
      `}</style>
    </motion.div>
  );
};
