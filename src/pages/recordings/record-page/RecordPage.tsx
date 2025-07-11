import { Fragment } from 'react';
import { Container } from '@/components/container';
import { api } from '@/api/axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Navbar, NavbarActions } from '@/partials/navbar';
import { KeenIcon } from '@/components';
import { ToolbarHeading } from '@/layouts/glaspro/toolbar';
import { RecordPageContent } from './RecordPageContent';
import type { Recording } from './RecordPageContent';

export function RecordPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: recording, isLoading } = useQuery<Recording>({
    queryKey: ['recording', id],
    queryFn: async () => {
      const response = await api.get(`/api/audio/files/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  }

  if (!recording) {
    return (
      <Container>
        <div>Recording not found</div>
      </Container>
    );
  }

  return (
    <Fragment>
      <Container>
        <ToolbarHeading title={recording.title} />
      </Container>

      <Container>
        <Navbar>
          <NavbarActions>
            <button type="button" className="btn btn-sm btn-primary">
              <KeenIcon icon="play" /> Play
            </button>
            <button type="button" className="btn btn-sm btn-light">
              <KeenIcon icon="download" /> Download
            </button>
            <button className="btn btn-sm btn-icon btn-light">
              <KeenIcon icon="share" />
            </button>
          </NavbarActions>
        </Navbar>
      </Container>

      <Container>
        <RecordPageContent recording={recording} />
      </Container>
    </Fragment>
  );
}