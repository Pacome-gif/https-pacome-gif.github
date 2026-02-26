// src/app/composants/dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // Tous les styles sont importés ici

// Types pour TypeScript
interface Task {
  id: number;
  title: string;
  tags: { text: string; type: string }[];
  date: string;
  hasImage: boolean;
  imageUrl?: string;
  status: 'completed' | 'progress' | 'pending';
}

const Dashboard: React.FC = () => {
  // État pour les tâches
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Gestion maiumi festal oimt",
      tags: [
        { text: "Status", type: "status" },
        { text: "Medium", type: "priority" }
      ],
      date: "Dec 2023",
      hasImage: true,
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop",
      status: "pending"
    },
    {
      id: 2,
      title: "Build a tenit mnnix",
      tags: [
        { text: "Medium", type: "priority" }
      ],
      date: "Dec 2023",
      hasImage: true,
      imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=200&fit=crop",
      status: "progress"
    },
    {
      id: 3,
      title: "Task a retutament",
      tags: [
        { text: "Status", type: "status" }
      ],
      date: "Dec 2023",
      hasImage: true,
      imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=200&fit=crop",
      status: "pending"
    },
    {
      id: 4,
      title: "Projects marformaines with you naed",
      tags: [
        { text: "Prestation", type: "prestation" },
        { text: "Medium", type: "priority" }
      ],
      date: "Dec 2023",
      hasImage: true,
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop",
      status: "completed"
    },
    {
      id: 5,
      title: "Legendarly report volume",
      tags: [
        { text: "Status", type: "status" }
      ],
      date: "Dec 2023",
      hasImage: true,
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
      status: "progress"
    },
    {
      id: 6,
      title: "Image integration",
      tags: [
        { text: "Status", type: "status" }
      ],
      date: "Dec 2023",
      hasImage: true,
      imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop",
      status: "completed"
    }
  ]);

  // État pour la page active
  const [currentPage, setCurrentPage] = useState('home');
  
  // État pour la modale
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calcul des statistiques
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.filter(t => t.status === 'progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  
  const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const progressPercent = total > 0 ? Math.round((progress / total) * 100) : 0;
  const pendingPercent = total > 0 ? Math.round((pending / total) * 100) : 0;

  // Mise à jour du donut chart
  useEffect(() => {
    updateDonutChart();
  }, [tasks]);

  const updateDonutChart = () => {
    // Logique du donut chart (à implémenter avec des refs ou une bibliothèque)
  };

  // Rendu des tâches
  const renderTasks = () => {
    return tasks.map(task => (
      <div key={task.id} className="task-card">
        <div className="task-header">
          <div style={{ flex: 1 }}>
            <h3 className="task-title">{task.title}</h3>
            <div className="task-tags">
              {task.tags.map((tag, index) => (
                <span key={index} className={`tag ${tag.type}`}>{tag.text}</span>
              ))}
            </div>
          </div>
          <div className="task-avatar">{task.title.charAt(0).toUpperCase()}</div>
        </div>
        
        {task.hasImage && task.imageUrl ? (
          <div className="task-image">
            <img src={task.imageUrl} alt={task.title} />
          </div>
        ) : (
          <div className="task-image">
            <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
              <path d="M10 50 L30 30 L50 40 L70 20" stroke="#CBD5E1" strokeWidth="2" fill="none"/>
              <circle cx="60" cy="15" r="5" fill="#CBD5E1"/>
            </svg>
          </div>
        )}
        
        <div className="task-footer">
          <div className="task-date">
            <span>📅</span>
            <span>{task.date}</span>
          </div>
        </div>
      </div>
    ));
  };

  // Navigation
  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <main className="main">
      {/* HEADER */}
      <header className="header">
        <h1 className="header-title">Task List</h1>
        <div className="header-actions">
          <div className="user-group">
            <div className="avatar" title="User 1">A</div>
            <div className="avatar" title="User 2">B</div>
            <div className="avatar" title="Add user">+</div>
          </div>
          <button className="btn-new-task" onClick={() => setIsModalOpen(true)}>
            <span>+</span>
            <span>New Task</span>
          </button>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="sidebar" id="sidebar">
        <div className="logo">
          <div className="logo-icon">✓</div>
          <div className="logo-text">TaskFlow</div>
        </div>

        <nav className="nav">
          <a 
            href="#" 
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
          >
            <span className="nav-icon"></span>
            <span>Home</span>
          </a>
          <a 
            href="#" 
            className={`nav-item ${currentPage === 'tasks' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('tasks'); }}
          >
            <span className="nav-icon"></span>
            <span>Tasks</span>
          </a>
          <a 
            href="#" 
            className={`nav-item ${currentPage === 'creatives' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('creatives'); }}
          >
            <span className="nav-icon"></span>
            <span>Creatives</span>
          </a>
          <a 
            href="#" 
            className={`nav-item ${currentPage === 'favorites' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigateTo('favorites'); }}
          >
            <span className="nav-icon">⭐</span>
            <span>Favorites</span>
          </a>
        </nav>

        <div className="nav-arrow" id="navArrow">
          <span>‹</span>
        </div>
      </aside>

      {/* STATISTICS BAR */}
      <section className="stats-bar">
        <div className="stats-grid">
          {/* Total Tasks */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon total">📊</div>
              <div className="stat-content">
                <div className="stat-label">Total Tasks</div>
                <div className="stat-value">{total}</div>
                <div className="stat-change neutral">All tasks</div>
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-header">
                <span className="progress-bar-label">Progress</span>
                <span className="progress-bar-percent">100%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill total" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon completed">✓</div>
              <div className="stat-content">
                <div className="stat-label">Completed</div>
                <div className="stat-value">{completed}</div>
                <div className="stat-change positive">↗ {completedPercent}%</div>
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-header">
                <span className="progress-bar-label">Completion rate</span>
                <span className="progress-bar-percent">{completedPercent}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill completed" style={{ width: `${completedPercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon progress">⏳</div>
              <div className="stat-content">
                <div className="stat-label">In Progress</div>
                <div className="stat-value">{progress}</div>
                <div className="stat-change neutral">Active tasks</div>
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-header">
                <span className="progress-bar-label">Activity rate</span>
                <span className="progress-bar-percent">{progressPercent}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill progress" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon pending">⏰</div>
              <div className="stat-content">
                <div className="stat-label">Pending</div>
                <div className="stat-value">{pending}</div>
                <div className="stat-change negative">To start</div>
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-header">
                <span className="progress-bar-label">Pending rate</span>
                <span className="progress-bar-percent">{pendingPercent}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill pending" style={{ width: `${pendingPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHART SECTION */}
      <section className="chart-section">
        <div className="chart-header">
          <h3 className="chart-title">📊 Tasks Overview - Répartition statistique</h3>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ background: 'var(--success)' }}></div>
              <span>Completed</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: 'var(--warning)' }}></div>
              <span>In Progress</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: 'var(--danger)' }}></div>
              <span>Pending</span>
            </div>
          </div>
        </div>

        {/* DONUT CHART (simplifié - à implémenter avec une lib) */}
        <div className="donut-container">
          <div className="donut-wrapper">
            <svg className="donut-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="12" />
              <circle className="donut-segment" cx="50" cy="50" r="40" fill="none" stroke="var(--success)" strokeWidth="12" 
                      strokeDasharray={`${(completed/total)*251.2} 251.2`} strokeDashoffset="0" />
              <circle className="donut-segment" cx="50" cy="50" r="40" fill="none" stroke="var(--warning)" strokeWidth="12" 
                      strokeDasharray={`${(progress/total)*251.2} 251.2`} strokeDashoffset={`-${(completed/total)*251.2}`} />
              <circle className="donut-segment" cx="50" cy="50" r="40" fill="none" stroke="var(--danger)" strokeWidth="12" 
                      strokeDasharray={`${(pending/total)*251.2} 251.2`} strokeDashoffset={`-${((completed+progress)/total)*251.2}`} />
            </svg>
            
            <div className="donut-center-text">
              <div className="donut-center-number">{total}</div>
              <div className="donut-center-label">total</div>
            </div>
          </div>

          <div className="donut-legend-detailed">
            <div className="donut-legend-item">
              <div className="donut-legend-color" style={{ background: 'var(--success)' }}></div>
              <div className="donut-legend-text">
                <div className="donut-legend-title">Completed</div>
                <div className="donut-legend-subtitle">
                  <span className="donut-legend-value">{completed}</span> tâches
                </div>
              </div>
            </div>
            
            <div className="donut-legend-item">
              <div className="donut-legend-color" style={{ background: 'var(--warning)' }}></div>
              <div className="donut-legend-text">
                <div className="donut-legend-title">In Progress</div>
                <div className="donut-legend-subtitle">
                  <span className="donut-legend-value">{progress}</span> tâches
                </div>
              </div>
            </div>
            
            <div className="donut-legend-item">
              <div className="donut-legend-color" style={{ background: 'var(--danger)' }}></div>
              <div className="donut-legend-text">
                <div className="donut-legend-title">Pending</div>
                <div className="donut-legend-subtitle">
                  <span className="donut-legend-value">{pending}</span> tâches
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: 15, paddingTop: 15, borderTop: '1px dashed var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span>Progression globale</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{completedPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TASKS GRID */}
      <section className="content">
        <div className="content-header">
          <h2 className="section-title">Tasks</h2>
          <button className="filter-btn">
            <span>📊</span>
            <span>All fare</span>
            <span>▾</span>
          </button>
        </div>
        <div className="task-grid">
          {renderTasks()}
        </div>
      </section>

      {/* MODAL NEW TASK */}
      {isModalOpen && (
        <div className="modal open" onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Nouvelle tâche</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Formulaire */}
              <div className="form-group">
                <label className="form-label">Titre de la tâche</label>
                <input type="text" className="form-input" placeholder="Ex: Créer le dashboard" required />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">Créer la tâche</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;