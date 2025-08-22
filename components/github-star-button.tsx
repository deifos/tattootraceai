import { Button } from '@heroui/button';
import { siteConfig } from '@/config/site';
import { GitHubIcon } from '@/components/icons/GitHubIcon';

export function GitHubStarButton() {
  return (
    <Button
      as='a'
      endContent={<span>⭐</span>}
      href={siteConfig.links.github}
      rel='noopener noreferrer'
      size='sm'
      startContent={<GitHubIcon className='w-4 h-4' />}
      target='_blank'
      variant='bordered'
    >
      Leave a Star
    </Button>
  );
}
