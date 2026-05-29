// Placeholder layout — built in Chunk 7
// Will add central + right-sidebar layout structure
import { Outlet } from 'react-router-dom';
export default function DatabaseLayout() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Database</h1>
      <Outlet />
    </div>
  );
}
