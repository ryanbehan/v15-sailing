import { sectionId } from '../lib/seo';

export default function SectionHeading({ as: Tag = 'h2', anchor, children, ...props }) {
  return <Tag id={sectionId(anchor || children)} {...props}>{children}</Tag>;
}
