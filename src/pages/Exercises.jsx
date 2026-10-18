import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Award,
  HelpCircle,
  RotateCcw,
  ChevronRight,
  Filter,
  ArrowRight,
  Send
} from 'lucide-react';
import { EXERCISES } from '../data/exercises';
import { MODULES } from '../data/modulesMeta';

export default function Exercises({ onSelectModule, onNavigate }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Resposta do aluno
  const [selectedOption, setSelectedOption] = useState(null);
  const [numericAnswer, setNumericAnswer] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Pontuação da Sessão no localStorage
  const [score, setScore] = useState(() => {
    try {
      const saved = localStorage.getItem('fisica_lab_score');
      return saved ? JSON.parse(saved) : { correct: 0, total: 0 };
    } catch {
      return { correct: 0, total: 0 };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fisica_lab_score', JSON.stringify(score));
    } catch {}
  }, [score]);

  // Lista filtrada
  const filteredExercises = EXERCISES.filter((ex) => {
    if (selectedFilter === 'all') return true;
    return ex.moduleId === selectedFilter;
  });

  const currentExercise = filteredExercises[currentQuestionIndex] || filteredExercises[0] || EXERCISES[0];

  const handleSelectFilter = (filterId) => {
    setSelectedFilter(filterId);
    setCurrentQuestionIndex(0);
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setNumericAnswer('');
    setHasSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (hasSubmitted) return;

    let correct = false;
    if (currentExercise.type === 'choice') {
      correct = selectedOption === currentExercise.correctIndex;
    } else {
      const num = parseFloat(numericAnswer.replace(',', '.'));
      if (!Number.isNaN(num)) {
        const diff = Math.abs(num - currentExercise.correctValue);
        correct = diff <= (currentExercise.tolerance || 0.1);
      }
    }

    setIsCorrect(correct);
    setHasSubmitted(true);
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleNextQuestion = () => {
    resetQuestionState();
    setCurrentQuestionIndex((prev) => (prev + 1) % filteredExercises.length);
  };

  const handleResetScore = () => {
    setScore({ correct: 0, total: 0 });
    try {
      localStorage.removeItem('fisica_lab_score');
    } catch {}
  };

  const relatedModule = MODULES.find((m) => m.id === currentExercise.moduleId);

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      {/* Cabeçalho da Página de Exercícios */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <div className="badge badge-green" style={{ marginBottom: '0.5rem' }}>
            <CheckCircle2 size={14} /> Fixação e Aprendizado
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--color-text-main)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Exercícios Interativos de Cinemática
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)' }}>
            Resolva problemas reais, verifique seus cálculos e acompanhe a resolução passo a passo.
          </p>
        </div>

        {/* Placar de Pontuação Local */}
        <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 12, padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={24} color="var(--primary-600)" />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
                Desempenho da Sessão
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-text-main)', fontFamily: 'var(--font-mono)' }}>
                {score.correct} / {score.total}{' '}
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                  ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>
          {score.total > 0 && (
            <button
              onClick={handleResetScore}
              title="Zerar pontuação da sessão"
              style={{ color: 'var(--color-text-subtle)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filtros por Módulo de Estudo */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
        <button
          className={`chart-tab-btn ${selectedFilter === 'all' ? 'active' : ''}`}
          onClick={() => handleSelectFilter('all')}
        >
          Todas as Questões ({EXERCISES.length})
        </button>
        {MODULES.map((m) => {
          const count = EXERCISES.filter((e) => e.moduleId === m.id).length;
          return (
            <button
              key={m.id}
              className={`chart-tab-btn ${selectedFilter === m.id ? 'active' : ''}`}
              onClick={() => handleSelectFilter(m.id)}
            >
              Módulo {m.number}: {m.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Card da Questão Ativa */}
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <div className="exercise-card">
          <div className="exercise-header">
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-blue">Questão {currentQuestionIndex + 1} de {filteredExercises.length}</span>
                <span className="badge badge-amber">{currentExercise.difficulty}</span>
                {relatedModule && (
                  <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                    {relatedModule.title}
                  </span>
                )}
              </div>
              <h2 className="exercise-title">{currentExercise.title}</h2>
            </div>
            {currentExercise.hint && (
              <button
                className="sim-ctrl-btn"
                onClick={() => setShowHint(!showHint)}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
              >
                <HelpCircle size={15} color="var(--primary-600)" />
                <span>{showHint ? 'Ocultar Dica' : 'Dica'}</span>
              </button>
            )}
          </div>

          {showHint && (
            <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.875rem', color: '#854d0e', marginBottom: '1.25rem' }}>
              <strong>Dica de Estudo:</strong> {currentExercise.hint}
            </div>
          )}

          <div className="exercise-question">
            {currentExercise.question}
          </div>

          {/* Opções de Múltipla Escolha */}
          {currentExercise.type === 'choice' && (
            <div className="exercise-options">
              {currentExercise.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    className={`exercise-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => !hasSubmitted && setSelectedOption(idx)}
                    disabled={hasSubmitted}
                  >
                    <span
                      style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        borderRadius: '50%',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        backgroundColor: isSelected ? 'var(--primary-600)' : '#ffffff',
                        color: isSelected ? '#ffffff' : 'var(--color-text-muted)'
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Campo Numérico com Unidade */}
          {currentExercise.type === 'numeric' && (
            <form onSubmit={handleSubmit} style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Digite sua resposta numérica..."
                  value={numericAnswer}
                  onChange={(e) => setNumericAnswer(e.target.value)}
                  disabled={hasSubmitted}
                  style={{
                    width: '240px',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
                <span style={{ fontWeight: '700', color: 'var(--color-text-subtle)' }}>
                  {currentExercise.unit}
                </span>
              </div>
            </form>
          )}

          {/* Botões de Ação */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '1.25rem' }}>
            {!hasSubmitted ? (
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={
                  (currentExercise.type === 'choice' && selectedOption === null) ||
                  (currentExercise.type === 'numeric' && !numericAnswer.trim())
                }
              >
                <Send size={16} />
                <span>Verificar Resposta</span>
              </button>
            ) : (
              <button className="btn-primary" onClick={handleNextQuestion}>
                <span>Próxima Questão</span>
                <ChevronRight size={16} />
              </button>
            )}

            {relatedModule && (
              <button
                className="btn-secondary"
                onClick={() => {
                  onSelectModule(relatedModule.id);
                  onNavigate('simulations');
                }}
              >
                <span>Experimentar na Simulação</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>

          {/* Feedback e Resolução Passo a Passo após tentativa */}
          {hasSubmitted && (
            <div className={`exercise-feedback-box ${isCorrect ? 'feedback-success' : 'feedback-error'}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                {isCorrect ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
                <span>{isCorrect ? 'Resposta Correta! Parabéns!' : 'Resposta Incorreta.'}</span>
              </div>

              {!isCorrect && currentExercise.type === 'numeric' && (
                <div style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                  A resposta correta é: <strong>{currentExercise.correctValue} {currentExercise.unit}</strong>.
                </div>
              )}

              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Resolução Passo a Passo:
                </div>
                <ol style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {currentExercise.explanation.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
