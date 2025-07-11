import { Container } from '@/components/container';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Recording {
  id: string;                    // UUID
  title: string;                 // Название файла
  mime_type: string;            // MIME-тип файла
  size_bytes: number;           // Размер в байтах
  duration_seconds: number;     // Длительность в секундах
  folder_path: string;          // Путь к файлу
  transcription_status: string;  // Статус транскрибации (uploaded и др.)
  user_id: string;              // UUID пользователя
  uploaded_at: string;          // Дата загрузки в ISO формате
  deleted: boolean;             // Флаг удаления
}

export function AllRecordingsPage() {
  const { data: recordings, isLoading } = useQuery<Recording[]>({
    queryKey: ['recordings'],
    queryFn: async () => {
      const response = await api.get('/api/audio/files');
      return response.data;
    }
  });

  return (
    <Container>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recordings?.map((recording) => (
              <TableRow key={recording.id}>
                <TableCell>
                  <Link 
                    to={`/recordings/${recording.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    {recording.title}
                  </Link>
                </TableCell>
                <TableCell>{recording.mime_type}</TableCell>
                <TableCell>{(recording.size_bytes / 1024 / 1024).toFixed(2)} MB</TableCell>
                <TableCell>{recording.duration_seconds}s</TableCell>
                <TableCell>{recording.transcription_status}</TableCell>
                <TableCell>{new Date(recording.uploaded_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
}