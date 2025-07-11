import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';

const SidebarHeader = forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <div ref={ref}>
      <div className="flex items-center gap-2 h-[70px] px-4">
        <Link to="/" className="shrink-0">
          <img
            src={toAbsoluteUrl('/media/app/default-logo.svg')}
            className="h-[42px] dark:hidden"
            alt="logo"
          />
          <img
           src={toAbsoluteUrl('/media/app/default-logo-dark.svg')}
            className="h-[42px] hidden dark:block"
            alt="logo-dark"
          />
        </Link>
        
      </div>
    </div>
  );
});

export { SidebarHeader };
