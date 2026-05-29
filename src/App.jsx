// ============================================================
// App.jsx — root router
// All routes defined here. Pages are placeholder <h1> until
// their chunk is built. Layout shell added in Chunk 2.
// ============================================================
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider }     from '@shared/contexts/AuthContext';
import { LanguageProvider } from '@shared/contexts/LanguageContext';
import ProtectedRoute from '@shared/components/guards/ProtectedRoute';
import AdminRoute     from '@shared/components/guards/AdminRoute';

// ── Pages ────────────────────────────────────────────────────
import LoginPage          from '@modules/auth/LoginPage';
import DashboardPage      from '@modules/dashboard/DashboardPage';
import KpiListPage        from '@modules/kpis/KpiListPage';
import KpiDetailPage      from '@modules/kpis/KpiDetailPage';
import TodosPage          from '@modules/todos/TodosPage';
import TeamPage           from '@modules/team/TeamPage';
import MemberDetailPage   from '@modules/team/MemberDetailPage';
import ProfilePage        from '@modules/profile/ProfilePage';
import DatabaseLayout     from '@modules/database/DatabaseLayout';
import CompaniesPage      from '@modules/database/companies/CompaniesPage';
import CompanyDetailPage  from '@modules/database/companies/CompanyDetailPage';
import ArticlesPage       from '@modules/database/articles/ArticlesPage';
import ArticleDetailPage  from '@modules/database/articles/ArticleDetailPage';
import ReportsPage        from '@modules/reports/ReportsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected — all authenticated users */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/kpis"      element={<ProtectedRoute><KpiListPage /></ProtectedRoute>} />
            <Route path="/kpis/:id"  element={<ProtectedRoute><KpiDetailPage /></ProtectedRoute>} />
            <Route path="/todos"     element={<ProtectedRoute><TodosPage /></ProtectedRoute>} />
            <Route path="/profile"   element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* Database — nested layout with right sidebar */}
            <Route path="/database" element={<ProtectedRoute><DatabaseLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="companies" replace />} />
              <Route path="companies"     element={<CompaniesPage />} />
              <Route path="companies/:id" element={<CompanyDetailPage />} />
              <Route path="articles"      element={<ArticlesPage />} />
              <Route path="articles/:id"  element={<ArticleDetailPage />} />
            </Route>

            {/* Admin only */}
            <Route path="/team"           element={<AdminRoute><TeamPage /></AdminRoute>} />
            <Route path="/team/:userId"   element={<AdminRoute><MemberDetailPage /></AdminRoute>} />
            <Route path="/reports"        element={<AdminRoute><ReportsPage /></AdminRoute>} />

            {/* Fallback */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
