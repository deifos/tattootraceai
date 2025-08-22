'use client';

import { Accordion, AccordionItem } from '@heroui/accordion';
import { motion, Variants } from 'framer-motion';
import { Link } from '@heroui/link';

import { title } from '@/components/primitives';
import { XIcon } from '@/components/icons';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function FAQ() {
  const faqData = [
    {
      key: 'refund-policy',
      title: 'Why are there no refunds after image generation?',
      content:
        'Once tattoo designs are generated, we cannot offer refunds because running AI models incurs real computational costs that cannot be recovered. Each generation uses expensive GPU processing power through our AI providers. However, we\'re confident in our service quality and offer sample designs on our website so you can see the expected results before purchasing.',
    },
    {
      key: 'ai-mistakes',
      title: "What if the AI makes mistakes or the results aren't perfect?",
      content:
        "AI tattoo generation can sometimes produce unexpected results. Most issues can be improved by refining your design description or trying a different style category. We recommend being specific about what you want (e.g., 'traditional dragon sleeve with black ink' instead of just 'dragon tattoo'). If you're not satisfied with a generation, try adjusting your description and generating again.",
    },
    {
      key: 'image-storage',
      title: 'How long are my images stored? Do I need to download them?',
      content: (
        <>
          Generated tattoo design records/URLs are removed from your TattooTraceAI
          account after 48 hours for privacy and storage management. Design
          generation and temporary storage are handled by our provider, FAL.ai,
          which usually retains generated assets for approximately 7 days. See:{' '}
          <Link isExternal href='https://fal.ai/privacy'>
            https://fal.ai/privacy
          </Link>
          . We strongly recommend downloading your designs immediately after
          generation. You can download individual designs or save them to your device.
        </>
      ),
    },
    {
      key: 'upload-requirements',
      title: 'What kind of photo should I upload for best results?',
      content:
        "Upload a clear, well-lit photo of the body part where you want the tattoo. The best results come from: high-resolution images (at least 512x512px), good lighting with the skin clearly visible, minimal background distractions, and photos taken straight-on. Photos of arms, legs, back, chest, etc. all work well.",
    },
    {
      key: 'commercial-use',
      title: 'Can I use the generated images commercially?',
      content:
        'Yes! You have full rights to all generated tattoo designs. You can use them for tattoo consultations, sharing with tattoo artists, social media, and any other personal purposes. The designs are yours to use without any additional licensing fees or attribution requirements.',
    },
    {
      key: 'credit-system',
      title: 'How does the credit system work?',
      content:
        "Each tattoo design generation or overlaying uses 1 credit, regardless of style or category. Credits don't expire, so you can use them whenever you want. We offer affordable credit packages that let you generate multiple design variations to find the perfect tattoo for you.",
    },
    {
      key: 'generation-time',
      title: 'How long does it take to generate images?',
      content:
        'Most tattoo designs are generated within 30-60 seconds. Generation time can vary based on server load and the complexity of your design request. More detailed designs may take slightly longer to ensure quality results.',
    },
    {
      key: 'privacy-security',
      title: 'Is my uploaded photo secure and private?',
      content: (
        <>
          Yes, we take privacy seriously. Your uploaded photos are processed
          securely and used only for generating your requested tattoo designs. We
          don&apos;t store your original photos longer than necessary for
          processing, and we never use your images for marketing or training
          purposes. Image processing and temporary storage are handled by our
          generation provider, FAL.ai. Generated assets are usually deleted by
          FAL after approximately 7 days — see their privacy policy:{' '}
          <Link isExternal href='https://fal.ai/privacy'>
            https://fal.ai/privacy
          </Link>
          .
        </>
      ),
    },
    {
      key: 'styles-categories',
      title: 'What styles and categories are available?',
      content:
        'We offer multiple tattoo style categories including Traditional, Realistic, Minimalist, Geometric, and you can create yours by typing a well detailed prompt.'
    },
  ];

  return (
    <section
      className='w-full min-h-screen snap-start flex items-center'
      id='faq'
    >
      <div className='container mx-auto max-w-4xl px-6 py-16'>
        <motion.h2
          className={title({
            size: 'md',
            fullWidth: true,
            className: 'text-center',
          })}
          initial='hidden'
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView='visible'
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.p
          className='text-center text-default-600 text-lg mt-4 mb-12'
          initial='hidden'
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView='visible'
        >
          Everything you need to know about TattooTraceAI
        </motion.p>

        <motion.div
          initial='hidden'
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView='visible'
        >
          <Accordion className='gap-4' variant='splitted'>
            {faqData.map(faq => (
              <AccordionItem
                key={faq.key}
                aria-label={faq.title}
                className='bg-content1/60 border border-default-100 px-6 py-2'
                classNames={{
                  title: 'text-lg font-semibold text-foreground',
                  content: 'text-default-600 leading-relaxed pb-4',
                }}
                title={faq.title}
              >
                {faq.content}
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact section */}
        <motion.div
          className='mt-12 text-center'
          initial='hidden'
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView='visible'
        >
          <div className='bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20'>
            <h3 className='text-xl font-semibold mb-2'>
              Still have questions?
            </h3>
            <p className='text-default-600 mb-4'>
              Can&apos;t find what you&apos;re looking for? Reach out to me on{' '}
              <Link isExternal href='https://x.com/deifosv'>
                {' '}
                <XIcon className='w-4 h-4' />
              </Link>{' '}
              or through the feedback bubble.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
