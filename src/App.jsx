// ============================================================
// App.jsx — root router
// ============================================================
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider }     from '@shared/contexts/AuthContext';
import { LanguageProvider } from '@shared/contexts/LanguageContext';
import ProtectedRoute from '@shared/components/guards/ProtectedRoute';
import AdminRoute     from '@shared/components/guards/AdminRoute';
import AppLayout      from '@shared/components/layout/AppLayout';

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

// ── Layout wrappers ──────────────────────────────────────────

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </ProtectedRoute>
  );
}

function AdminLayout() {
  return (
    <AdminRoute>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </AdminRoute>
  );
}

function DatabaseWrapper() {
  return (
    <ProtectedRoute>
      <AppLayout fullBleed>
        <DatabaseLayout />
      </AppLayout>
    </ProtectedRoute>
  );
}

// ── App ─────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected pages */}
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/kpis"      element={<KpiListPage />} />
              <Route path="/kpis/:id"  element={<KpiDetailPage />} />
              <Route path="/todos"     element={<TodosPage />} />
              <Route path="/profile"   element={<ProfilePage />} />
            </Route>

            {/* Admin only pages */}
            <Route element={<AdminLayout />}>
              <Route path="/team"         element={<TeamPage />} />
              <Route path="/team/:userId" element={<MemberDetailPage />} />
              <Route path="/reports"      element={<ReportsPage />} />
            </Route>

            {/* Database — fullBleed layout with nested routes */}
            <Route path="/database" element={<DatabaseWrapper />}>
              <Route index element={<Navigate to="companies" replace />} />
              <Route path="companies"     element={<CompaniesPage />} />
              <Route path="companies/:id" element={<CompanyDetailPage />} />
              <Route path="articles"      element={<ArticlesPage />} />
              <Route path="articles/:id"  element={<ArticleDetailPage />} />
            </Route>

            {/* Fallback */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
