import { useState } from 'react';

/**
 * Reusable CodeBlock component with safe Clipboard API and fallback execCommand
 */
export function CodeBlock({ code, language = 'json', title, maxHeight = '420px' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older browsers or non-https
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-title">{title || language.toUpperCase()}</span>
        <button
          type="button"
          onClick={handleCopy}
          className={`btn-copy ${copied ? 'copied' : ''}`}
          aria-label="Copiar código para área de transferência"
        >
          {copied ? '✓ Copiado!' : 'Copiar'}
        </button>
      </div>
      <pre className="code-block-pre" style={{ maxHeight }}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
