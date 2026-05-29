// Placeholder — built in Chunk 8
import { useParams } from 'react-router-dom';
export default function ArticleDetailPage() {
  const { id } = useParams();
  return <div><h2>Article Detail</h2><p>ID: {id} — Placeholder — Chunk 8</p></div>;
}
