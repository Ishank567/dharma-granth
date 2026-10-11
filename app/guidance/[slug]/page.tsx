import WisdomTopicPage, {
  generateMetadata as baseGenerateMetadata,
  generateStaticParams as baseGenerateStaticParams,
} from '@/app/wisdom-for-life/[slug]/page';

export const generateStaticParams = baseGenerateStaticParams;
export const generateMetadata = baseGenerateMetadata;
export default WisdomTopicPage;
