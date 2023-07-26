import clsx from 'clsx';
import {MediaFile} from '@shopify/hydrogen';
import {Heading, Text, Link} from '~/components';

/**
 * Hero component that renders metafields attached to collection resources
 **/
export function Hero({
  byline,
  cta,
  handle,
  heading,
  height,
  loading,
  spread,
  spreadSecondary,
  top,
}) {
  
  return (
    <Link to={`/collections/${handle}`}>
  <section className="relative w-full h-96 md:h-144 lg:h-1500">
    <div className="absolute inset-0">
      <img
        loading="lazy"
        src="https://rb.gy/eq4mj"
        alt="banner"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="absolute inset-0 flex flex-col justify-end px-6 py-8 sm:px-8 md:px-12 bg-gradient-to-t dark:from-contrast/60 dark:text-primary from-primary/60 text-contrast bg-opacity-70 z-10">
      <Heading format as="h2" size="display" className="text-xl md:text-2xl lg:text-3xl font-bold max-w-md">
        Best Seller Necklaces
      </Heading>
      <Text format width="narrow" as="p" size="lead" className="text-base md:text-lg leading-relaxed">
        Resgister Your Product Today!
      </Text>
    </div>
  </section>
</Link>



  );
}

function SpreadMedia({data, loading, sizes}) {
  return (
    <MediaFile
      data={data}
      className="block object-cover w-full h-full"
      mediaOptions={{
        video: {
          controls: false,
          muted: true,
          loop: true,
          playsInline: true,
          autoPlay: true,
          previewImageOptions: {src: data.previewImage?.url ?? ''},
        },
        image: {
          loading,
          crop: 'center',
          sizes,
          alt: data.alt || '',
        },
      }}
    />
  );
}
