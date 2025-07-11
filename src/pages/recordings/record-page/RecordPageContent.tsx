export interface Recording {
  id: string;
  title: string;
  mime_type: string;
  size_bytes: number;
  duration_seconds: number;
  folder_path: string;
  transcription_status: string;
  user_id: string;
  uploaded_at: string;
  deleted: boolean;
}

interface RecordPageContentProps {
  recording: Recording;
}

export function RecordPageContent({ recording }: RecordPageContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <section className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-center text-gray-500">
            Audio player will be implemented here
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Recording Details</h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-gray-500">Type</dt>
                <dd>{recording.mime_type}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Size</dt>
                <dd>{(recording.size_bytes / 1024 / 1024).toFixed(2)} MB</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Duration</dt>
                <dd>{recording.duration_seconds}s</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Status</dt>
                <dd>{recording.transcription_status}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Uploaded</dt>
                <dd>{new Date(recording.uploaded_at).toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
} 