// src/components/ui/TextPressure/TextPressure.tsx
import { useEffect, useRef, useState } from 'react';

interface TextPressureProps {
    text?: string;
    fontFamily?: string;
    fontUrl?: string;
    width?: boolean;
    weight?: boolean;
    italic?: boolean;
    alpha?: boolean;
    flex?: boolean;
    stroke?: boolean;
    scale?: boolean;
    textColor?: string;
    strokeColor?: string;
    className?: string;
    minFontSize?: number;
}

const TextPressure: React.FC<TextPressureProps> = ({
    text = 'Compressa',
    fontFamily = 'Playfair Display', // Using your brand font
    fontUrl = '', // Will fallback to system fonts
    width = true,
    weight = true,
    italic = true,
    alpha = false,
    flex = true,
    stroke = false,
    scale = false,
    textColor = 'hsl(var(--color-deep-charcoal))', // Your theme color
    strokeColor = 'hsl(var(--color-copper-bourbon))', // Your accent color
    className = '',
    minFontSize = 24,
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

    const mouseRef = useRef({ x: 0, y: 0 });
    const cursorRef = useRef({ x: 0, y: 0 });

    const [fontSize, setFontSize] = useState(minFontSize);
    const [scaleY, setScaleY] = useState(1);
    const [lineHeight, setLineHeight] = useState(1);

    const chars = text.split('');

    const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            cursorRef.current.x = e.clientX;
            cursorRef.current.y = e.clientY;
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const t = e.touches[0];
                cursorRef.current.x = t.clientX;
                cursorRef.current.y = t.clientY;
            }
        };

        // Ensure we're listening to the right events
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true });

        if (containerRef.current) {
            const { left, top, width, height } = containerRef.current.getBoundingClientRect();
            mouseRef.current.x = left + width / 2;
            mouseRef.current.y = top + height / 2;
            cursorRef.current.x = mouseRef.current.x;
            cursorRef.current.y = mouseRef.current.y;
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    const setSize = () => {
        if (!containerRef.current || !titleRef.current) return;

        const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

        // Adjust font size calculation for multi-line text
        const textLines = text.split('\n');
        const longestLine = textLines.reduce((longest, current) => 
            current.length > longest.length ? current : longest
        );
        
        let newFontSize = containerW / (longestLine.length / 1.8); // Adjusted for multi-line
        newFontSize = Math.max(newFontSize, minFontSize);

        setFontSize(newFontSize);
        setScaleY(1);
        setLineHeight(1.2); // Better line height for multi-line

        requestAnimationFrame(() => {
            if (!titleRef.current) return;
            const textRect = titleRef.current.getBoundingClientRect();

            if (scale && textRect.height > 0) {
                const yRatio = containerH / textRect.height;
                if (yRatio < 1) {
                    setScaleY(yRatio);
                    setLineHeight(yRatio * 1.2);
                }
            }
        });
    };

    useEffect(() => {
        setSize();
        window.addEventListener('resize', setSize);
        return () => window.removeEventListener('resize', setSize);
    }, [scale, text]);

    useEffect(() => {
        let rafId: number;
        const animate = () => {
            mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
            mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

            if (titleRef.current) {
                const titleRect = titleRef.current.getBoundingClientRect();
                const maxDist = titleRect.width / 2;

                spansRef.current.forEach((span) => {
                    if (!span) return;

                    const rect = span.getBoundingClientRect();
                    const charCenter = {
                        x: rect.x + rect.width / 2,
                        y: rect.y + rect.height / 2,
                    };

                    const d = dist(mouseRef.current, charCenter);

                    const getAttr = (distance: number, minVal: number, maxVal: number) => {
                        const val = maxVal - Math.abs((maxVal * distance) / maxDist);
                        return Math.max(minVal, val + minVal);
                    };

                    const wdth = width ? Math.floor(getAttr(d, 5, 200)) : 100;
                    const wght = weight ? Math.floor(getAttr(d, 100, 900)) : 400;
                    const italVal = italic ? getAttr(d, 0, 1).toFixed(2) : 0;
                    const alphaVal = alpha ? getAttr(d, 0, 1).toFixed(2) : 1;

                    span.style.opacity = alphaVal.toString();
                    span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
                });
            }

            rafId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(rafId);
    }, [width, weight, italic, alpha, chars.length]);

    const dynamicClassName = [className, flex ? 'flex' : '', stroke ? 'stroke' : '']
        .filter(Boolean)
        .join(' ');

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: 'transparent',
            }}
        >
            <style>{`
        ${fontUrl ? `@font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
        }` : ''}

        .flex {
          display: flex;
          justify-content: space-between;
        }

        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${strokeColor};
        }

        .text-pressure-title {
          color: ${textColor};
        }

        /* Medical theme enhancements */
        .medical-hero-text {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .medical-hero-text span {
          transition: all 0.3s ease;
        }

        /* Dark mode support */
        [data-theme="dark"] .text-pressure-title {
          color: hsl(var(--color-antique-white));
        }
      `}</style>

            <h1
                ref={titleRef}
                className={`text-pressure-title ${dynamicClassName}`}
                style={{
                    fontFamily,
                    textTransform: 'uppercase',
                    fontSize: fontSize,
                    lineHeight,
                    transform: `scale(1, ${scaleY})`,
                    transformOrigin: 'center top',
                    margin: 0,
                    textAlign: 'center',
                    userSelect: 'none',
                    whiteSpace: 'pre-line', // Allow line breaks
                    fontWeight: 100,
                    width: '100%',
                }}
            >
                {chars.map((char, i) => (
                    <span
                        key={i}
                        ref={(el) => (spansRef.current[i] = el)}
                        data-char={char}
                        style={{
                            display: 'inline-block',
                            color: stroke ? undefined : textColor
                        }}
                    >
                        {char}
                    </span>
                ))}
            </h1>
        </div>
    );
};

export default TextPressure;