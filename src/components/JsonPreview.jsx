import { useState } from 'react';

export function JsonPreview({ jsonString, isValid, missingFields }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(jsonString);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = jsonString;
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

  const handleDownload = () => {
    try {
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'meu-prompt.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Falha ao baixar:', err);
    }
  };

  return (
    <div className="json-preview-container">
      <div className="preview-top-bar">
        <div className="preview-title-wrap">
          <span className="json-icon">📦</span>
          <span className="preview-title">JSON Gerado ao Vivo</span>
        </div>

        <div className="preview-actions">
          <button
            type="button"
            className={`btn-action-copy ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title="Copiar prompt completo para área de transferência"
          >
            {copied ? '✓ Copiado!' : '📋 Copiar JSON'}
          </button>

          <button
            type="button"
            className="btn-action-download"
            onClick={handleDownload}
            title="Baixar arquivo meu-prompt.json"
          >
            💾 Baixar .json
          </button>
        </div>
      </div>

      <div className="validation-status-bar">
        {isValid ? (
          <span className="status-pill status-success">
            ✓ Estrutura pronta! Pode copiar e colar na sua IA favorita.
          </span>
        ) : (
          <span className="status-pill status-warning">
            ⚠️ Preencha os campos obrigatórios: {missingFields.join(', ')}
          </span>
        )}
      </div>

      <pre className="json-code-box">
        <code>{jsonString}</code>
      </pre>

      <div className="preview-footer-tip">
        <span>💡 Dica: Cole este bloco no <strong>ChatGPT</strong>, <strong>Claude</strong>, <strong>Gemini</strong> ou <strong>Copilot</strong>.</span>
      </div>
    </div>
  );
}
