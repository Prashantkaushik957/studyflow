'use client';

export default function imageLoader({ src, width, quality }: { src: string; width?: number; quality?: number }) {
    // If explicitly absolute URL (external), return as is
    if (src.startsWith('http')) return src;

    const isProduction = process.env.NODE_ENV === 'production';
    const repoName = 'studyflow';
    const basePath = isProduction ? `/${repoName}` : '';

    // Prevent double-prefixing if basePath is already included
    if (basePath && src.startsWith(basePath)) {
        return `${src}?w=${width || 750}&q=${quality || 75}`;
    }

    // Ensure src starts with slash
    const cleanSrc = src.startsWith('/') ? src : `/${src}`;

    return `${basePath}${cleanSrc}?w=${width || 750}&q=${quality || 75}`;
}
