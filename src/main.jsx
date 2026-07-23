import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error("Erro na aplicação:", error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: 24,
          fontFamily: "sans-serif", textAlign: "center", background: "#0D0D0F", color: "#fff",
        }}>
          <p style={{ fontSize: 16, marginBottom: 12 }}>Ocorreu um erro ao carregar o app.</p>
          <p style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>{String(this.state.error.message || this.state.error)}</p>
          <button onClick={() => window.location.reload()} style={{
            padding: "10px 20px", borderRadius: 8, border: "none",
            background: "#E8B84B", color: "#0D0D0F", fontWeight: 700, cursor: "pointer",
          }}>
            Recarregar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
