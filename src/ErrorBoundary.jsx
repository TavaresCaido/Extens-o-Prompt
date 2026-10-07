import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Falha capturada no ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="pagina-centro" role="alert">
          <div className="cartao" style={{ maxWidth: '480px', textAlign: 'center' }}>
            <h1 className="titulo-md">Algo deu errado</h1>
            <p className="texto-suave" style={{ margin: '16px 0 24px' }}>
              Ocorreu uma falha inesperada na aplicacao.
            </p>
            <button
              type="button"
              className="botao botao-primario"
              onClick={this.handleReload}
            >
              Recarregar
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
