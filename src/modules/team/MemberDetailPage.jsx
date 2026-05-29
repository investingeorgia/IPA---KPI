// Placeholder — built in Chunk 7
import { useParams } from 'react-router-dom';
export default function MemberDetailPage() {
  const { userId } = useParams();
  return <div style={{ padding: 40 }}><h1>Member Detail</h1><p>User: {userId} — Placeholder — Chunk 7</p></div>;
}
